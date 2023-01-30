
// FIXED IMPORTS:
import { rng } from "../misc/util.js";
import { dropItemFromBlock } from "../item/dropItem.js";
import { ctx, TILE_SIZE } from "../game/global.js";
import { sprites } from "../game/graphics/loadAssets.js";

// Link tile ID and Registry Name
const ID_NAME_LINK = [
    {id:1,registryName:"tile_dirt"},
    {id:2,registryName:"tile_grass"},
    {id:3,registryName:"tile_stone"},
    {id:4,registryName:"wall_log"},
    {id:5,registryName:"tile_leaves"},
    {id:6,registryName:"liquid_water"},
    {id:7,registryName:"wall_dirt"},
    {id:8,registryName:"wall_stone"},
]

export class Tile {
    constructor(gridX,gridY,world) {
        this.world = world; // Pointer
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * TILE_SIZE;
        this.y = -gridY * TILE_SIZE;
        this.w = TILE_SIZE;
        this.h = TILE_SIZE;
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;

        this.objectType;
        this.toolType;
        this.miningLevel;
        this.miningTime = 0;

        this.transparent = false;
        this.connective = true;

        this.tileDrops = [];

        this.sx = 0;
        this.sy = 0;
    }

    setRegistryName(name) {
        this.registryName = name;
        this.id = getTileID(name);
    }

    // Set the tile sprite.
    setSprite(sprite) {

        this.missingTexture = false;
        this.sprite = sprite;

        // If texture is missing, use 'missing texture'
        if(!this.sprite) {
            this.sprite = sprites.misc.missing_texture;
            this.missingTexture = true;
        }
    }

    /**
     * Set sprite offset position
     * (Used for spritesheets)
     * 
     * @param {int} offsetX // X offset in pixels
     * @param {int} offsetY // Y offset in pixels
     */
     setSpriteOffset(offsetX,offsetY) {
        
        if(!offsetX || !offsetY) {
            this.sx = 0;
            this.sy = 0;
        } else {
            this.sx = offsetX;
            this.sy = offsetY;
        }
    }

    // Draw the sprite.
    drawSprite() {
        ctx.drawImage(
            this.sprite,this.sx,this.sy,TILE_SIZE,TILE_SIZE,this.x,this.y,TILE_SIZE,TILE_SIZE
        );
    }

    // Remove the tile and drop its items.
    breakTile(toolType,toolLevel) {
        if(this.objectType == "wall") {
            this.world.clearWall(this.gridX,this.gridY);
        } else {
            this.world.clearTile(this.gridX,this.gridY);
        }

        this.dropItems(toolType,toolLevel);
        this.world.updateNearbyTiles(this.gridX,this.gridY);
    }

    // Loop through this tile's drops. Runs when the tile is broken.
    dropItems(toolType,toolLevel) {
        for(let i=0;i<this.tileDrops.length;i++) {
            const drop = this.tileDrops[i];
            

            // If tool is required and isn't used, the item is not dropped.
            if(drop.requireTool && toolType != this.toolType) {
                continue;
            }

            // If drop rate RNG isn't high enough, the item is not dropped.
            let rand = rng(1,100);
            if(rand > drop.rate) {
                continue;
            }

            // If 'amount' is a number, drop that amount.
            // If 'amount' is an array, the first number is the minimum, and the second is maximum.
            let itemAmount = 0;
            if(Array.isArray(drop.amount)) {
                itemAmount = rng(drop.amount[0],drop.amount[1]);
            } else {
                itemAmount = drop.amount;
            }
            dropItemFromBlock(this,drop.id,itemAmount,this.world.game);
        }
    }

    // Runs whenever the tile is "refreshed", i.e. something happens to an adjacent tile.
    tileUpdate() {
        return;
    }

    // Runs at a regular interval (not every frame)
    tickUpdate() {
        return;
    }

    getAdjacent() {
        let adjacent = {
            tl:false,tm:false,tr:false,ml:false,mr:false,bl:false,bm:false,br:false
        };

        let checkTile = (x,y) => {
            try {
                if(this.world.getTile(x,y)) {
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        }

        adjacent.tl = checkTile(this.gridX-1,this.gridY+1);
        adjacent.tm = checkTile(this.gridX,this.gridY+1);
        adjacent.tr = checkTile(this.gridX+1,this.gridY+1);
        adjacent.ml = checkTile(this.gridX-1,this.gridY);
        adjacent.mr = checkTile(this.gridX+1,this.gridY);
        adjacent.bl = checkTile(this.gridX-1,this.gridY-1);
        adjacent.bm = checkTile(this.gridX,this.gridY-1);
        adjacent.br = checkTile(this.gridX+1,this.gridY-1);

        return adjacent;
    }

    // This is a very messy way to do this and probably isn't optimal
    // But to be honest, I can't come up with a better one.
    getTilesetSource() {
        if(this.connective == false) {
            this.sx = 0;
            this.sy = 0;
            return;
        }

        let a = this.getAdjacent();
        let s = [];

        // Top Left
        if(!a.ml && !a.tm && a.mr && a.bm) {
            if(a.br) {s = [0,0]} 
            else {s = [0,4]}
        }

        // Top Right
        else if(a.ml && !a.tm && !a.mr && a.bm) {
            if(a.bl) {s = [2,0]} 
            else {s = [4,4]}
        }

        // Bottom Left
        else if(!a.ml && a.tm && a.mr && !a.bm) {
            if(a.tr) {s = [0,2]}
            else {s = [0,8]}
        }


        // Bottom Right
        else if(a.ml && a.tm && !a.mr && !a.bm) {
            if(a.tl) {s = [2,2]} 
            else {s = [4,8]}
        }


        // Top
        else if(a.ml && !a.tm && a.mr && a.bm) {
            if(a.bl && a.br) {s = [1,0]}
            else if(!a.bl && a.br) {s = [1,4]}
            else if(!a.bl && !a.br) {s = [2,4]}
            else if(a.bl && !a.br) {s = [3,4]}
        }

        // Left
        else if(!a.ml && a.tm && a.mr && a.bm) {
            if(a.tr && a.br) {s = [0,1]}
            else if(!a.tr && a.br) {s = [0,5]}
            else if(!a.tr && !a.br) {s = [0,6]}
            else if(a.tr && !a.br) {s = [0,7]}
        }

        // Right
        else if(a.ml && a.tm && !a.mr && a.bm) {
            if(a.tl && a.bl) {s = [2,1]}
            else if(!a.tl && a.bl) {s = [4,5]}
            else if(!a.tl && !a.bl) {s = [4,6]}
            else if(a.tl && !a.bl) {s = [4,7]}
            
        }

        // Bottom
        else if(a.ml && a.tm && a.mr && !a.bm) {
            if(a.tl && a.tr) {s = [1,2]}
            else if(!a.tl && a.tr) {s = [1,8]}
            else if(!a.tl && !a.tr) {s = [2,8]}
            else if(a.tl && !a.tr) {s = [3,8]}
        }

        // Pillar pieces

        // L
        else if(!a.ml && !a.tm && a.mr && !a.bm) {s = [0,3]}

        // =
        else if(a.ml && !a.tm && a.mr && !a.bm) {s = [1,3]}

        // R
        else if(a.ml && !a.tm && !a.mr && !a.bm) {s = [2,3]}

        // T
        else if(!a.ml && !a.tm && !a.mr && a.bm) {s = [3,0]}

        //  ||
        else if(!a.ml && a.tm && !a.mr && a.bm) {s = [3,1]}

        // B
        else if(!a.ml && a.tm && !a.mr && !a.bm) {s = [3,2]}

        // No blocks around
        else if(!a.ml && !a.tm && !a.mr && !a.bm) {s = [3,3]}

        // ---------------------

        // Corner Pieces

        else if(a.tm && a.ml && a.mr && a.bm) {
            // Single
            if(a.tl && a.tr && a.bl && !a.br) {s = [4,0]}
            else if(a.tl && !a.tr && a.bl && a.br) {s = [4,1]}
            else if(a.tl && a.tr && !a.bl && a.br) {s = [4,2]}
            else if(!a.tl && a.tr && a.bl && a.br) {s = [4,3]}
            // Double
            else if(a.tl && a.tr && !a.bl && !a.br) {s = [2,7]}
            else if(a.tl && !a.tr && a.bl && !a.br) {s = [3,6]}
            else if(!a.tl && a.tr && !a.bl && a.br) {s = [1,6]}
            else if(!a.tl && !a.tr && a.bl && a.br) {s = [2,5]}
            // Diagonal double
            else if(!a.tl && a.tr && a.bl && !a.br) {s = [5,0]}
            else if(a.tl && !a.tr && !a.bl && a.br) {s = [5,1]}
            // Triple
            else if(a.tl && !a.tr && !a.bl && !a.br) {s = [3,7]}
            else if(!a.tl && a.tr && !a.bl && !a.br) {s = [1,7]}
            else if(!a.tl && !a.tr && a.bl && !a.br) {s = [3,5]}
            else if(!a.tl && !a.tr && !a.bl && a.br) {s = [1,5]}
            // Quad
            else if(!a.tl && !a.tr && !a.bl && !a.br) {s = [2,6]}
            // No edge or corners
            else {s = [1,1]}
        }

        if(this.missingTexture) {
            this.sx = 0;
            this.sy = 0;
        } else {
            this.sx = 12 + (s[0] * 60);
            this.sy = 12 + (s[1] * 60);
        }
    }
}

export function getTileID(registryName) {
    for(let i=0;i<ID_NAME_LINK.length;i++) {
        if(ID_NAME_LINK[i].registryName == registryName) {
            return ID_NAME_LINK[i].id;
        }
    }
    return false;
}





