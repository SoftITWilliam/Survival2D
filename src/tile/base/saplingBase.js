import { rng } from "../../misc/util.js";
import { BasicTree } from "../../structure/structureParent.js";
import PlaceableBase from "./placeableBase.js";

export default class SaplingBase extends PlaceableBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.objectType = "nonSolid";
        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 0.2;
        this.requireTool = true;

        this.tree = new BasicTree(this.gridX,this.gridY,this.world);
        this.growthValue = 255;
    }

    /**
     * Remove the sapling and grow a tree in its place
     */
    growTree() {
        this.world.clearTile(this.gridX,this.gridY);
        if(this.tree) {
            this.tree.generate();
            console.log("GROWING SUCCESSFUL");
        }
    }

    /**
     * Roll a random number between 0 and 'value'. If number is equal to 'value', grow a tree (if conditions are met).
     * Runs every frame
     * @param {number} n Growth chance (1 in n). 0 guarantees growth.
     * @returns null
     */
    tryToGrow(n) {
        let rand = rng(0,n);

        if(rand == n) {
            console.log("TRYING TO GROW");
            if(this.checkGrowCondition()) {
                this.growTree();
            }
        }
    }

    /**
     * Check if the tree is able to grow in its current position.
     * @returns {boolean}
     */
    checkGrowCondition() {

        // Check for solid blocks above sapling
        let minimumSpace = 8;
        for(let y = this.gridY + 1; y < this.gridY + minimumSpace; y++) {
            let tile = this.world.getTile(this.gridX, y)
            if(tile && !tile.transparent) {
                console.log("CANNOT GROW: SOLID BLOCK ABOVE");
                return false;
            }
        }

        // Check for logs near sapling
        let logDistanceX = 1;
        let logDistanceY = 5;
        for(let x = this.gridX - logDistanceX; x <= this.gridX + logDistanceX; x++) {
            for(let y = this.gridY; y <= this.gridY + logDistanceY; y++) {
                let object = this.world.getWall(x,y);
                console.log(object);
                if(object && object.registryName == "wall_log") {
                    console.log("CANNOT GROW: LOG NEARBY");
                    return false;
                }
            }
        }

        return true;
    }

    tickUpdate() {
        this.tryToGrow(this.growthValue);
    }

    tileUpdate() {
        if(!this.world.getTile(this.gridX, this.gridY - 1)) {
            this.breakTile();
        }
    }
}