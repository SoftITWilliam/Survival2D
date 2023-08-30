
import { ctx, DRAWDIST, TILE_SIZE } from "../game/global.js";
import { clamp } from "../helper/helper.js";

export default class LightingGrid {
    constructor(world) {
        this.world = world;

        this.grid = [];

        // Create grid
        for(let x=0;x<world.width;x++) {
            let row = [];
            for(let y=0;y<world.height;y++) {
                row.push(null)
            }
            this.grid.push(row);
        }
    }

    get(x,y) {
        return this.world.outOfBounds(x,y) ? null : this.grid[x][y];
    }

    generate() {
        // Create light sources
        this.setLightSources(0, 0, this.world.width, this.world.height);

        // Cycle through all light levels.
        // If a tile has the light level, all surrounding tiles *that are unassigned* are assigned a lower light level
        // (-1 for walls, -2 for solid tiles)
        for(let l = 16; l > 0; l-- ) {
            for(let x = 0 ; x < this.world.width ; x++ ) {
                for(let y = 0 ; y < this.world.height ; y++ ) {
                    this.spreadAround(x,y,l);
                }
            }
        }

        this.setDefaultLevel();
    }

    // Update light levels (on screen only);
    update(player) {
        let dist = {x: DRAWDIST.x * 2, y: DRAWDIST.y * 2};
        let gX = clamp(player.gridX, dist.x, this.world.width - dist.x);
        let gY = clamp(player.gridY, dist.y, this.world.height - dist.y);
        let x1 = gX - dist.x; let x2 = gX + dist.x;
        let y1 = gY - dist.y; let y2 = gY + dist.y; 
    
        // Reset grid on screen
        for(let x = x1; x < x2 ; x++) {
            for(let y = y1 ; y < y2 ; y++) {
                this.grid[x][y] = null;
            }
        }
    
        this.setLightSources(x1, y1, x2, y2);
    
        // Cycle through all 15 light levels.
        // If a tile has the light level, all surrounding tiles *that are unassigned* are assigned a lower light level
        // (-1 for walls, -2 for solid tiles)
        for(let l = 16; l > 0; l-- ) {
            for(let x = x1 - 1; x < x2 + 1 ; x++) {
                for(let y = y1 - 1 ; y < y2 + 1 ; y++) {
                    if(this.world.outOfBounds(x, y)) continue;
                    this.spreadAround(x, y, l);
                }
            }
        }
        
        this.setDefaultLevel();
    }

    spreadAround(x, y, level) {
        if(!this.get(x, y) || this.get(x, y).level != level) {
            return;
        }
        // Spread lighting to surrounding blocks
        this.spreadTo(x - 1, y, level); // Left
        this.spreadTo(x + 1, y, level); // Right
        this.spreadTo(x, y + 1, level); // Top
        this.spreadTo(x, y - 1, level); // Bottom uwu :3
    }

    spreadTo(x,y,level) {
        if(this.world.outOfBounds(x, y) || this.get(x, y)) return;

        if(level == 16) {
            this.grid[x][y] = {level:15}
        } else if(this.world.getTile(x,y)) {
            this.grid[x][y] = {level: clamp(level - 3, 0, 15)}
        } else {
            this.grid[x][y] = {level: clamp(level - 1, 0, 15)}
        }
    }

    setLightSources(x1,y1,x2,y2) {
        // Set light sources
        for(let x = x1; x < x2; x++) {
            for(let y = y1; y < y2; y++) {
                if(this.checkLightSource(x,y)) {
                    this.grid[x][y] = {level:16}
                };
            }
        }
    }

    // Return true if given tile is a light source
    // (Currently, the only light source in the game is any coordinate where there is no tile or wall)
    checkLightSource(x, y) {
        return (
            (!this.world.getTile(x, y) || this.world.getTile(x, y).isTransparent()) && 
            (!this.world.getWall(x, y) || this.world.getWall(x, y).isTransparent())
        );
    }

    // If no light level is assigned, set it to 0.
    setDefaultLevel() {
        for(let x = 0; x < this.world.width; x++) {
            for(let y = 0; y < this.world.height; y++) {
                if(!this.get(x, y)) {
                    this.grid[x][y] = {level:0}
                }
            }
        }     
    }

    draw(gX, gY) {
        for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x + 1 ; x++) {
            for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y + 1 ; y++) {

                // Cannot draw outside map
                if(this.world.outOfBounds(x, y)) continue;

                // Calculate opacity based on light level
                let light = this.grid[x][y];

                if(!light) continue;

                let a = clamp(1 - light.level / 15, 0, 1);

                ctx.fillStyle = `rgba(0,0,0,${a})`;
                ctx.fillRect(x * TILE_SIZE, -y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.globalAlpha = 1;
            }
        }
    }
}