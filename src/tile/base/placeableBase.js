import { Tile } from "../tile.js";

export default class PlaceableBase extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.objectType = "nonSolid";
        this.transparent = true;
        this.connective = false;
        this.requireTool = false;
    }

    // Override
    canBeMined(item) {
        if(item && item.placeable) {
            return false;
        }

        if(this.requireTool) {
            if(!item) {
                return false;
            }

            if(item.toolType != this.toolType) {
                return false;
            }
        }
        
        if(item && item.toolType == "hammer") {
            return false;
        }

        return true;
    }
}