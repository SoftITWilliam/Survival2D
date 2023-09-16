import { TILE_SIZE } from "../game/global.js";
import { SpriteRenderer } from "../game/graphics/SpriteRenderer.js";
import { sprites } from "../game/graphics/assets.js";
import { calculateDistance } from "../helper/helper.js";
import Item from "../item/item.js";

export default class PlacementPreview {
    constructor(sprite, sx, sy, spriteWidth, spriteHeight, item) {
        this.item = item;
        this.renderer = new SpriteRenderer(sprite);

        // If sprite is missing, use 'missing texture'
        if(!this.sprite) {
            this.sprite = sprites.misc["missing_texture"];
            this.missingTexture = true;
        } else {
            this.missingTexture = false;
        }

        this.aRange = [0.4, 0.7];

        this.a = this.aRange[0];
        this.aFade = 0.02;

        this.setSpriteOffset(sx, sy);
        this.setSpriteSize(spriteWidth, spriteHeight);
    }
    
    //#region Getters/setters

    set sprite(sourceImage) { this.renderer.setSource(sourceImage) }

    get sprite() { return this.renderer.source }

    setSpriteOffset(sx, sy) {
        this.renderer.setSourcePosition(sx, sy);
    }

    setSpriteSize(width, height) {
        this.renderer.setSpriteSize(width, height);
    }

    //#endregion

    //#region Methods

    // Alpha (a) goes back and forth between the lower and higher points in this.aRange
    updateAlpha() {
        this.a += this.aFade;
        if((this.aFade > 0 && this.a >= this.aRange[1]) || 
            (this.aFade < 0 && this.a <= this.aRange[0])) {
                this.aFade *= -1;
        }
    }

    //#endregion

    //#region Render methods

    render(ctx, gridX, gridY, player) {
        this.updateAlpha();

        // If out of placement range, 
        let pos = {
            centerX: gridX * TILE_SIZE + TILE_SIZE / 2,
            centerY: -gridY * TILE_SIZE + TILE_SIZE / 2
        }

        let distance = calculateDistance(player, pos);
        let inPlacementRange = distance <= player.reach;
        
        if (inPlacementRange && this.item.canBePlaced(gridX, gridY, player.world)) {
            ctx.globalAlpha = this.a;
        } else {
            ctx.globalAlpha = 0.05;
        }

        this.renderer.render(ctx, gridX * TILE_SIZE, -gridY * TILE_SIZE, 48, 48);

        ctx.globalAlpha = 1;
    }

    //#endregion

    //#region Static methods 
    
    /**
     * Automatically create a PlacementPreview instance using an item's sx, sy, sw, and sh properties.
     * @param {Item} item 
     * @param {Image} sprite 
     */
    static fromItem(item, sprite) {
        return new PlacementPreview(sprite, item.sx, item.sy, item.sw, item.sh, item);
    }
    //#endregion
}



/**
 * If a tile can be placed in the given position return true.
 * A placement position is valid if it is touching another tile
 * or if there's a wall behind it
 * 
 * @param {number} gridX X position in grid
 * @param {number} gridY Y position in grid
 * @returns {boolean}
 */
export function validPlacementPosition(gridX,gridY,world) {

    // Check if tile is already occupied
    if (world.tiles.get(gridX,gridY)) {
        return false;
    }

    // Check for adjacent tile or wall
    if (world.tiles.get(gridX - 1, gridY) || 
        world.tiles.get(gridX + 1, gridY) ||
        world.tiles.get(gridX, gridY - 1) || 
        world.tiles.get(gridX, gridY + 1) ||
        world.walls.get(gridX, gridY)) {
            return true;
    }
    return false;
}
