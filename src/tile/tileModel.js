import { TILE_SIZE } from "../game/global.js";
import { SpriteRenderer } from "../game/graphics/SpriteRenderer.js";
import { sprites } from "../game/graphics/assets.js";
import { dropItemFromTile } from "../item/dropItem.js";
import Item from "../item/item.js";
import { Tile } from "./Tile.js";

const SPRITE_PADDING = 6;

export class TileModel {
    constructor(registryName, width = TILE_SIZE, height = TILE_SIZE) {
        this.registryName = registryName;
        this._type = Tile.types.NONE;
        this.w = width;
        this.h = height ?? width;
        this.tileDrops = [];

        this._spriteRenderer = new SpriteRenderer();
        this._spriteRenderer.setSpriteSize(60, 60);
    }

    get width() { return this.w }
    get height() { return this.h }

    get type() {
        return this._type ?? Tile.types.NONE;
    }

    // Use 'Tile.types' enum
    set type(tileType) {
        if(typeof tileType != "number") {
            return console.warn("Invalid tile type");
        }
        this._type = tileType;
    }

    /**
     * Set the mining properties of the tile model
     * @param {int} toolType (toolTypes enum) Effective tool type
     * @param {int} toolLevel Which level of tool is required to count as effective
     * @param {number} miningTime How long the tool takes to mine by hand, in seconds
     * @param {boolean} requireTool If a tool is required to mine the tile at all.
     */
    setMiningProperties(toolType, toolLevel, miningTimeSeconds, requireTool) {
        this.toolType = toolType ?? null;
        this.toolLevel = toolLevel;
        this.miningTime = miningTimeSeconds;
        this.requireTool = requireTool;
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

        this._spriteRenderer.setSource(this.sprite);
    }

    // Remove the tile and drop its items.
    breakTile(tile, item = null, world) {
        if(this.type == Tile.types.WALL) {
            world.clearWall(tile.gridX, tile.gridY);
        } else {
            world.clearTile(tile.gridX, tile.gridY);
        }
        
        this.dropItems(tile, (Item.isTool(item) ? item : null), world);

        world.updateNearbyTiles(tile.gridX, tile.gridY);
    }

    // Loop through this tile's drops. Runs when the tile is broken.
    dropItems(tile, item, world) {
        this.tileDrops.forEach(tileDrop => {
            const drop = tileDrop.roll(this, item, 1);
            if(drop) {
                dropItemFromTile(tile, drop.item, drop.amount, world.game);
            }
        })
    }

    canBeMined() {
        return false;
    }

    // Runs whenever the tile is "refreshed", i.e. something happens to an adjacent tile.
    tileUpdate(tile, world) {
        
    }

    // Runs at a regular interval (not every frame)
    tickUpdate(tile, world) {
        
    }

    // Return spritesheet position based on which tiles are adjacent
    getSpritePosition(a) {
        if(this.connective == false) {
            return {x:0, y:0};
        }
        
        // Top Left
        if(!a.ml && !a.tm && a.mr && a.bm) {
            return a.br ? {x:0, y:0} : {x:0, y:4}
        }

        // Top Right
        if(a.ml && !a.tm && !a.mr && a.bm) {
            return a.bl ? {x:2, y:0} : {x:4, y:4}
        }

        // Bottom Left
        if(!a.ml && a.tm && a.mr && !a.bm) {
            return a.tr ? {x:0, y:2} : {x:0, y:8}
        }

        // Bottom Right
        if(a.ml && a.tm && !a.mr && !a.bm) {
            return a.tl ? {x:2, y:2} : {x:4, y:8}
        }

        // Top
        if(a.ml && !a.tm && a.mr && a.bm) {
            if(a.bl && a.br) {return {x:1, y:0}}
            else if(!a.bl && a.br) {return {x:1, y:4}}
            else if(!a.bl && !a.br) {return {x:2, y:4}}
            else if(a.bl && !a.br) {return {x:3, y:4}}
        }

        // Left
        else if(!a.ml && a.tm && a.mr && a.bm) {
            if(a.tr && a.br) {return {x:0, y:1}}
            else if(!a.tr && a.br) {return {x:0, y:5}}
            else if(!a.tr && !a.br) {return {x:0, y:6}}
            else if(a.tr && !a.br) {return {x:0, y:7}}
        }

        // Right
        else if(a.ml && a.tm && !a.mr && a.bm) {
            if(a.tl && a.bl) {return {x:2, y:1}}
            else if(!a.tl && a.bl) {return {x:4, y:5}}
            else if(!a.tl && !a.bl) {return {x:4, y:6}}
            else if(a.tl && !a.bl) {return {x:4, y:7}}
            
        }

        // Bottom
        else if(a.ml && a.tm && a.mr && !a.bm) {
            if(a.tl && a.tr) {return {x:1, y:2}}
            else if(!a.tl && a.tr) {return {x:1, y:8}}
            else if(!a.tl && !a.tr) {return {x:2, y:8}}
            else if(a.tl && !a.tr) {return {x:3, y:8}}
        }

        // Pillar pieces

        // L
        else if(!a.ml && !a.tm && a.mr && !a.bm) {return {x:0, y:3}}

        // =
        else if(a.ml && !a.tm && a.mr && !a.bm) {return {x:1, y:3}}

        // R
        else if(a.ml && !a.tm && !a.mr && !a.bm) {return {x:2, y:3}}

        // T
        else if(!a.ml && !a.tm && !a.mr && a.bm) {return {x:3, y:0}}

        //  ||
        else if(!a.ml && a.tm && !a.mr && a.bm) {return {x:3, y:1}}

        // B
        else if(!a.ml && a.tm && !a.mr && !a.bm) {return {x:3, y:2}}

        // No blocks around
        else if(!a.ml && !a.tm && !a.mr && !a.bm) {return {x:3, y:3}}

        // ---------------------

        // Corner Pieces

        else if(a.tm && a.ml && a.mr && a.bm) {
            // Single
            if(a.tl && a.tr && a.bl && !a.br) {return {x:4, y:0}}
            else if(a.tl && !a.tr && a.bl && a.br) {return {x:4, y:1}}
            else if(a.tl && a.tr && !a.bl && a.br) {return {x:4, y:2}}
            else if(!a.tl && a.tr && a.bl && a.br) {return {x:4, y:3}}
            // Double
            else if(a.tl && a.tr && !a.bl && !a.br) {return {x:2, y:7}}
            else if(a.tl && !a.tr && a.bl && !a.br) {return {x:3, y:6}}
            else if(!a.tl && a.tr && !a.bl && a.br) {return {x:1, y:6}}
            else if(!a.tl && !a.tr && a.bl && a.br) {return {x:2, y:5}}
            // Diagonal double
            else if(!a.tl && a.tr && a.bl && !a.br) {return {x:5, y:0}}
            else if(a.tl && !a.tr && !a.bl && a.br) {return {x:5, y:1}}
            // Triple
            else if(a.tl && !a.tr && !a.bl && !a.br) {return {x:3, y:7}}
            else if(!a.tl && a.tr && !a.bl && !a.br) {return {x:1, y:7}}
            else if(!a.tl && !a.tr && a.bl && !a.br) {return {x:3, y:5}}
            else if(!a.tl && !a.tr && !a.bl && a.br) {return {x:1, y:5}}
            // Quad
            else if(!a.tl && !a.tr && !a.bl && !a.br) {return {x:2, y:6}}
            // No edge or corners
            else {return {x:1, y:1}}
        }
    }

    render(ctx, tile, sheetX, sheetY) {
        this._spriteRenderer.setSheetPosition(sheetX, sheetY);
        this._spriteRenderer.renderFromObject(ctx, tile);
    }
}