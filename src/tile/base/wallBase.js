import { Tile } from "../tile.js";

export default class WallBase extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.objectType = "wall";
        this.toolType = "hammer";
        this.transparent = false;
        this.connective = true;
        this.requireTool = true;
    }

    // Override
    canBeMined(item) {
        if(item && item.placeable) {
            return false;
        }

        if(this.world.getTile(this.gridX,this.gridY) && !this.world.getTile(this.gridX,this.gridY).transparent) {
            return false;
        }

        if(this.requireTool) {
            if(!item) {
                return false;
            }

            if(item.toolType != "hammer") {
                return false;
            }
        }

        return true;
    }
}