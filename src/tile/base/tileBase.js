
import { toolTypes } from "../../item/itemTypes.js";
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
        if(item && item.placeable) return false;

        if(this.requireTool) {
            if(!item || item.toolType != this.toolType) return false;
        }

        if(item && item.toolType == toolTypes.HAMMER) return false;

        return true;
    }
}