
import { DRAWDIST } from "../game/global.js";
import { clamp } from "../misc/util.js";

function lightingSpread(x,y,level,world) {
    if(world.outOfBounds(x,y)) {
        return;
    } 
    
    if(world.lightGrid[x][y]) {
        return;
    }

    if(level == 16) {
        world.lightGrid[x][y] = {level:15}
    } else if(world.getTile(x,y)) {
        world.lightGrid[x][y] = {level: clamp(level-3,0,15)}
    } else {
        world.lightGrid[x][y] = {level: clamp(level-1,0,15)}
    }
}

function checkLightSource(x,y,world) {
    if((!world.getTile(x,y) || world.getTile(x,y).transparent) && 
        (!world.getWall(x,y) || world.getWall(x,y).transparent)) {
            return true;
            
    }
}

function lightingDefault(x,y,world) {
    if(!world.lightGrid[x][y]) {
        world.lightGrid[x][y] = {level:0}
    }
}

export function createLightGrid(world) {

    // Create grid
    for(let x=0;x<world.width;x++) {
        let row = [];
        for(let y=0;y<world.height;y++) {
            row.push(null)
        }
        world.lightGrid.push(row);
    }

    // Set light sources
    for(let x=0;x<world.width;x++) {
        for(let y=0;y<world.height;y++) {
            if(checkLightSource(x,y,world)) {
                world.lightGrid[x][y] = {level:16}
            };
        }
    }

    // Cycle through all light levels.
    // If a tile has the light level, all surrounding tiles *that are unassigned* are assigned a lower light level
    // (-1 for walls, -2 for solid tiles)
    for(let l = 16; l > 0; l-- ) {
        for(let x=0;x<world.width;x++) {
            for(let y=0;y<world.height;y++) {
                if(!world.lightGrid[x][y] || world.lightGrid[x][y].level != l) {
                    continue;
                }
                // Spread lighting to surrounding blocks
                lightingSpread(x-1,y,l,world); // Left
                lightingSpread(x+1,y,l,world); // Right
                lightingSpread(x,y+1,l,world); // Top
                lightingSpread(x,y-1,l,world); // Bottom uwu :3
            }
        }
    }
    
    // If no light level is assigned, it is 0.
    for(let x=0;x<world.width;x++) {
        for(let y=0;y<world.height;y++) {
            lightingDefault(x,y,world);
        }
    }
}

export function updateLighting(gX,gY,world) {

    gX = clamp(gX, DRAWDIST.x, world.width - DRAWDIST.x);
    gY = clamp(gY, DRAWDIST.y, world.height - DRAWDIST.y);

    // Reset grid on screen
    for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x ; x++) {
        for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y ; y++) {
            world.lightGrid[x][y] = null;
        }
    }

    // Create light sources
    for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x ; x++) {
        for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y ; y++) {
            if(checkLightSource(x,y,world)) {
                world.lightGrid[x][y] = {level:16}
            };
        }
    }

    // Cycle through all 15 light levels.
    // If a tile has the light level, all surrounding tiles *that are unassigned* are assigned a lower light level
    // (-1 for walls, -2 for solid tiles)
    for(let l = 16; l > 0; l-- ) {
        for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x ; x++) {
            for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y ; y++) {
                if(!world.lightGrid[x][y] || world.lightGrid[x][y].level != l) {
                    continue;
                }
                
                // Spread lighting to surrounding blocks
                lightingSpread(x-1,y,l,world); // Left
                lightingSpread(x+1,y,l,world); // Right
                lightingSpread(x,y+1,l,world); // Top
                lightingSpread(x,y-1,l,world); // Bottom uwu :3
            }
        }
    }
    
    // If no light level is assigned, it is 0.
    for(let x=0;x<world.width;x++) {
        for(let y=0;y<world.height;y++) {
            lightingDefault(x,y,world);
        }
    }
}