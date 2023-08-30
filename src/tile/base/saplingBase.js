import { TILE_SIZE } from "../../game/global.js";
import { rng } from "../../helper/helper.js";
import { BasicTree } from "../../structure/structureParent.js";
import ObjectBase from "../base/ObjectBase.js";

export default class SaplingBase extends ObjectBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setType("nonSolid");
        this.setMiningProperties("axe", 0, 0.2, true);

        this.tree = new BasicTree(0, 0, this.world);
        this.growthValue = 255;
    }

    /**
     * Remove the sapling and grow a tree in its place
     */
    growTree(tile) {
        this.world.clearTile(tile.gridX, tile.gridY);
        if(this.tree) {
            this.tree.gridX = tile.gridX;
            this.tree.gridY = tile.gridY;
            this.tree.generate();
        }
    }

    /**
     * Roll a random number between 0 and 'value'. If number is equal to 'value', grow a tree (if conditions are met).
     * Runs every tick by default
     * Could also be used for any fertilizer items I add in the future
     * @param {number} n Growth chance (1 in n). 0 guarantees growth.
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
     * @returns {boolean}
     */
    checkGrowCondition(tile) {

        // Check for solid blocks above sapling
        let minimumSpace = 8;
        for(let y = tile.gridY + 1; y < tile.gridY + minimumSpace; y++) {
            let checkedTile = this.world.getTile(tile.gridX, y)
            if(checkedTile && !checkedTile.isTransparent()) {
                return false;
            }
        }

        // Check for logs near sapling
        let logDistanceX = 1;
        let logDistanceY = 5;
        for(let x = tile.gridX - logDistanceX; x <= tile.gridX + logDistanceX; x++) {
            for(let y = tile.gridY; y <= tile.gridY + logDistanceY; y++) {
                let object = this.world.getWall(x,y);
                if(object && object.registryName == "log") {
                    return false;
                }
            }
        }

        return true;
    }

    tickUpdate(tile) {
        this.tryToGrow(this.growthValue, tile);
    }

    tileUpdate(tile) {
        if(!this.world.getTile(tile.gridX, tile.gridY - 1)) {
            this.breakTile(tile);
        }
    }
}