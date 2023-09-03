import Item from "../../item/item.js";
import { Tile } from "../Tile.js";
import { TileModel } from "../tileModel.js";

export default class ObjectBase extends TileModel {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.type = Tile.types.NON_SOLID;
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
        
        if(Item.isTool(item, Item.toolTypes.HAMMER)) 
            return false;

        return true;
    }
}