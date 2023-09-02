import Item from "../../item/item.js";
import { toolTypes } from "../../item/itemTypes.js";
import { TileModel } from "../tileModel.js";

export default class ObjectBase extends TileModel {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.setType("nonSolid");
        this.transparent = true;
        this.connective = false;
        this.requireTool = false;
    }

    // Override
    canBeMined(item) {
        if(item && item.placeable)
            return false;

        if(this.requireTool && !Item.isTool(item, this.toolType)) 
            return false;
        
        if(Item.isTool(item, toolTypes.HAMMER)) 
            return false;

        return true;
    }
}