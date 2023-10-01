import { TILE_SIZE } from "../../game/global.js";
import { rng } from "../../helper/helper.js";
import Item from "../../item/item.js";
import { BasicTree } from "../../structure/structureParent.js";
import { World } from "../../world/World.js";
import { Tile } from "../Tile.js";
import ObjectBase from "../base/ObjectBase.js";
import { TileRegistry } from "../tileRegistry.js";

export default class SaplingBase extends ObjectBase {
    constructor(registryName) {
        super(registryName, TILE_SIZE, TILE_SIZE);
        this.type = Tile.types.NON_SOLID;
        this.setMiningProperties(Item.toolTypes.AXE, 0, 0.2, true);
        this.growthValue = 255;
    }

    /**
     * Remove the sapling and grow a tree in its place
     * @param {Tile} saplingTile
     */
    growTree(saplingTile) {
        let x = saplingTile.gridX, y = saplingTile.gridY;
        saplingTile.world.tiles.clear(x, y);
        let tree = new BasicTree(x, y, saplingTile.world);
        tree.generate();
    }

    /**
     * Roll a random number between 0 and 'value'. If number is equal to 'value', grow a tree (if conditions are met).
     * Runs every tick by default
     * Could also be used for any fertilizer items I add in the future
     * @param {number} n Growth chance (1 in n). 0 guarantees growth.
     * @param {Tile} tile
     */
    tryToGrow(n, tile) {
        if(rng(0, n) == n) {
            if(this.checkGrowCondition(tile)) {
                this.growTree(tile);
            }
        }
    }

    /**
     * Check if the tree is able to grow in its current position.
     * @param {Tile} tile
     * @returns {boolean}
     */
    checkGrowCondition(tile) {

        // Check for solid blocks above sapling
        let minimumSpace = 8;

        for(let y = tile.gridY + 1; y < tile.gridY + minimumSpace; y++) {
            let checkedTile = tile.world.tiles.get(tile.gridX, y)
            if(checkedTile && !checkedTile.transparent) {
                return false;
            }
        }

        // Check for logs near sapling
        let logDistanceX = 1, logDistanceY = 3;
        let x = tile.gridX - logDistanceX, y = tile.gridY - logDistanceY;
        let w = logDistanceX * 2 + 1, h = logDistanceY * 2 + 1;
        
        const nearby = tile.world.walls.asArray(x, y, w, h, true).find(
            object => (Tile.isTile(object, TileRegistry.LOG)))

        return nearby == null;
    }

    /**
     * @param {Tile} tile 
     * @param {World} world 
     */
    tickUpdate(tile, world) {
        this.tryToGrow(this.growthValue, tile);
    }

    /**
     * @param {Tile} tile 
     * @param {World} world 
     */
    tileUpdate(tile, world) {
        if(world.tiles.get(tile.gridX, tile.gridY - 1) == null) {
            tile.break();
        }
    }
}