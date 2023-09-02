
import Item from "../../item/item.js";
import { toolTypes } from "../../item/itemTypes.js";
import { TileModel } from "../tileModel.js";

export default class TileBase extends TileModel {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.setType("solid");
        this.transparent = false;
        this.connective = true;
    }

    // Override
    canBeMined(item) {
        if(item && item.placeable) return false;

        if(item && item.placeable)
            return false;

        if(this.requireTool && !Item.isTool(item, this.toolType)) 
            return false;
        
        if(Item.isTool(item, toolTypes.HAMMER)) 
            return false;

        return true;
    }
}