import { TILE_SIZE } from "../game/global.js";
import { SpriteRenderer } from "../graphics/SpriteRenderer.js";
import { MISSING_TEXTURE, getImageCallback, sprites } from "../graphics/assets.js";
import { calculateDistance, getPhysicsMultiplier } from "../helper/helper.js";
import Item from "../item/item.js";

const ALPHA_RANGE = [0.4, 0.7];
const ALPHA_FADE_SPEED = 0.02;
const ALPHA_OUT_OF_RANGE = 0.05;

export default class PlacementPreview {
    /**
     * @overload
     * @param {Item} item
     * @param {SpriteRenderer} renderer
     */
    /**
     * @overload
     * @param {Item} item
     * @param {Image} sprite 
     * @param {SpriteRenderer} renderer
     */
    /**
     * @overload
     * @param {Item} item
     * @param {Image} sprite 
     */
    /**
     * @overload
     * @param {Item} item
     * @param {Image} sprite 
     * @param {number} sx
     * @param {number} sy
     * @param {number} sWidth
     * @param {number} sHeight
     */
    constructor(...args) {

        this.renderer = args.find(arg => arg instanceof SpriteRenderer) || new SpriteRenderer();
        this.item = args.find(arg => arg instanceof Item);
        let img = args.find(arg => arg instanceof Image);
        if(img) this.sprite = img;

        if(args.length === 6) {
            this.setSpriteOffset(args[2], args[3]);
            this.setSpriteSize(args[4], args[5]);
        }
    }

    static alpha = ALPHA_RANGE[0];
    static alphaDelta = ALPHA_FADE_SPEED;

    //#region Getters/setters

    set sprite(img) { 
        getImageCallback(img, (result) => {
            this.renderer.setSource(result);
        })
    }

    get sprite() { 
        return this.renderer.source 
    }

    get hasMissingTexture() {
        return isMissingTexture(this.sprite);
    }

    setSpriteOffset(sx, sy) {
        this.renderer.setSourcePosition(sx, sy);
    }

    setSpriteSize(width, height) {
        this.renderer.setSpriteSize(width, height);
    }

    //#endregion

    //#region Render methods

    render(ctx, gridX, gridY, player) {

        // If out of placement range, 
        let pos = {
            centerX: gridX * TILE_SIZE + TILE_SIZE / 2,
            centerY: -gridY * TILE_SIZE + TILE_SIZE / 2
        }

        let inPlacementRange = calculateDistance(player, pos) <= player.reach;
        let canBePlaced = this.item.canBePlaced(gridX, gridY, player.world);
        
        ctx.globalAlpha = (inPlacementRange && canBePlaced) ? 
            PlacementPreview.alpha : ALPHA_OUT_OF_RANGE;

        this.renderer.render(ctx, gridX * TILE_SIZE, -gridY * TILE_SIZE, 48, 48);

        ctx.globalAlpha = 1;
    }

    //#endregion

    //#region Static methods 

    // Alpha value goes back and forth between the lower and higher points in ALPHA_RANGE
    // todo: use delta time
    static updateAlpha(deltaTime) {
        this.alpha += (this.alphaDelta * getPhysicsMultiplier(deltaTime));
        if((this.alphaDelta > 0 && this.alpha >= ALPHA_RANGE[1]) || 
            (this.alphaDelta < 0 && this.alpha <= ALPHA_RANGE[0])) {
                this.alphaDelta *= -1;
        }
    }
    
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
