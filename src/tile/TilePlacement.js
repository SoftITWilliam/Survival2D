
import { calculateDistance } from "../helper/helper.js";
import { ItemStack } from "../item/itemStack.js";
import { Collision } from "../misc/Collision.js";
import { Player } from "../player/player.js";
import { World } from "../world/World.js";
import { Tile } from "./Tile.js";
import { TileModel } from "./tileModel.js";

const placementResult = (success, info, tile) => {

    let result = {
        success: false,
        info: null,
        tile: null,
    };

    if(success)
        result.success = true;

    if(typeof info == "string") {
        result.info = info;
    }
        

    if(Tile.isTile(tile))
        result.tile = tile;

    return result;
};

export class TilePlacement {
    /**
     * @param {World} world World which the tile is being placed in
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * @typedef {object} PlacementResult
     * @property {boolean} success
     * @property {(string | null)} info
     * @property {(Tile | null)} tile
     */
    /**
     * Try to place an item from the stack in the world.
     * 
     * Note: Will deduct one item from the stack if successful,
     * but the stack will NOT be removed, unless the caller checks if the slot is empty.
     * @param {Player} player Player who is placing
     * @param {ItemStack} stack 
     * @param {number} gridX
     * @param {number} gridY
     * @returns {PlacementResult}
     */
    placeFromStack(player, stack = null, gridX, gridY) {
        try {
            const item = stack?.item;

            if(!stack || !player || !this.world || !item?.placeable) {
                return placementResult(false, "Invalid function input.");
            }

            if(!item.canBePlaced(gridX, gridY, this.world)) {
                return placementResult(false, "Invalid placement position.");
            }

            let tileModel = item.getPlacedTile();
            if(!tileModel instanceof TileModel) {
                return placementResult(false, "Item.getPlacedTile() did not return a Tile.");
            }

            // This 'tile' is purely theoretical, to check placement range and player overlap.
            // It's actually added to the world through 'this.world.setTile()' later on.
            let tile = new Tile(this.world, gridX, gridY, tileModel, player);
            if(calculateDistance(player, tile) > player.reach) {
                return placementResult(false, "Player is out of range.");
            } 
            if(tile.type == Tile.types.SOLID && Collision.rectangleOverlap(player, tile)) {
                return placementResult(false, "Tile cannot be placed on top of player.");
            }

            stack.placeItemIntoWorld(gridX, gridY, this.world);

            let placedTile = (tile.type === Tile.types.WALL) ?
                this.world.walls.get(gridX, gridY) : 
                this.world.tiles.get(gridX, gridY);

            if(!Tile.isTile(placedTile)) {
                return placementResult(false, "Somehow, despite passing all checks and validation, no tile was placed.");
            }

            this.world.handlePlacedTile(placedTile);
            return placementResult(true, "", placedTile);
        }
        catch(error) {
            return placementResult(false, "An error occured: " + error);
        }
    }
}