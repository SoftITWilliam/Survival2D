import { toolTypes } from "../../item/itemTypes.js";
import { TileModel } from "../tileModel.js";

export default class ObjectBase extends TileModel {
    constructor(world, registryName, width, height) {
        super(world, registryName, width, height);
        this.setType("nonSolid");
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
            if(!item) return false;
    
            if(item.toolType != this.toolType) return false;
        }
        
        if(item && item.toolType == toolTypes.HAMMER) {
            return false;
        }

        return true;
    }
}