
// FIXED IMPORTS:
import { clamp } from "../misc/util.js";
import { DRAWDIST, WORLD_HEIGHT, WORLD_WIDTH } from "../game/const.js";
import { tileGrid, wallGrid } from "./world.js";

export const lightGrid = [];

function lightingSpread(x,y,level) {
    if(x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT || lightGrid[x][y]) {
        return;
    }

    if(level == 16) {
        lightGrid[x][y] = {level:15}
    } else if(tileGrid[x][y]) {
        lightGrid[x][y] = {level: clamp(level-3,0,15)}
    } else {
        lightGrid[x][y] = {level: clamp(level-1,0,15)}
    }
}

// If lighting is null, it's set to 0.
function lightingDefault(x,y) {
    if(!lightGrid[x][y]) {
        lightGrid[x][y] = {level:0}
    }
}

function checkLightSource(x,y) {
    if((!tileGrid[x][y] || tileGrid[x][y].transparent) && 
        (!wallGrid[x][y] ||wallGrid[x][y].transparent)) {
            lightGrid[x][y] = {level:16}
    }
}

export function createLightingGrid() {

    // Create grid
    for(let x=0;x<WORLD_WIDTH;x++) {
        let row = [];
        for(let y=0;y<WORLD_WIDTH;y++) {
            row.push(null)
        }
        lightGrid.push(row);
    }

    // Create light sources
    for(let x=0;x<WORLD_WIDTH;x++) {
        for(let y=0;y<WORLD_WIDTH;y++) {
            checkLightSource(x,y);
        }
    }

    // Cycle through all 15 light levels.
    // If a tile has the light level, all surrounding tiles *that are unassigned* are assigned a lower light level
    // (-1 for walls, -2 for solid tiles)
    for(let l = 16; l > 0; l-- ) {
        for(let x=0;x<WORLD_WIDTH;x++) {
            for(let y=0;y<WORLD_WIDTH;y++) {
                if(!lightGrid[x][y] || lightGrid[x][y].level != l) {
                    continue;
                }
                // Spread lighting to surrounding blocks
                lightingSpread(x-1,y,l); // Left
                lightingSpread(x+1,y,l); // Right
                lightingSpread(x,y+1,l); // Top
                lightingSpread(x,y-1,l); // Bottom uwu :3
            }
        }
    }
    
    // If no light level is assigned, it is 0.
    for(let x=0;x<WORLD_WIDTH;x++) {
        for(let y=0;y<WORLD_WIDTH;y++) {
            lightingDefault(x,y);
        }
    }
}

export function updateLighting(gX,gY) {

    gX = clamp(gX, DRAWDIST.x, WORLD_WIDTH - DRAWDIST.x);
    gY = clamp(gY, DRAWDIST.y, WORLD_HEIGHT - DRAWDIST.y);

    // Reset grid on screen
    for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x ; x++) {
        for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y ; y++) {
            lightGrid[x][y] = null;
        }
    }

    // Create light sources
    for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x ; x++) {
        for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y ; y++) {
            checkLightSource(x,y);
        }
    }

    // Cycle through all 15 light levels.
    // If a tile has the light level, all surrounding tiles *that are unassigned* are assigned a lower light level
    // (-1 for walls, -2 for solid tiles)
    for(let l = 16; l > 0; l-- ) {
        for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x ; x++) {
            for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y ; y++) {
                if(!lightGrid[x][y] || lightGrid[x][y].level != l) {
                    continue;
                }
                
                // Spread lighting to surrounding blocks
                lightingSpread(x-1,y,l); // Left
                lightingSpread(x+1,y,l); // Right
                lightingSpread(x,y+1,l); // Top
                lightingSpread(x,y-1,l); // Bottom uwu :3
            }
        }
    }
    
    // If no light level is assigned, it is 0.
    for(let x=0;x<WORLD_WIDTH;x++) {
        for(let y=0;y<WORLD_WIDTH;y++) {
            lightingDefault(x,y);
        }
    }

}