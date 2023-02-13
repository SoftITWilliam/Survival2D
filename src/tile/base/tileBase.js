
import { TileModel } from "../tileModel.js";

export default class TileBase extends TileModel {
    constructor(world, registryName, width, height) {
        super(world, registryName, width, height);
        this.setType("solid");
        this.transparent = false;
        this.connective = true;
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