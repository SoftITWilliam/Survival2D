import Item from "../../item/item.js";
import { Tile } from "../Tile.js";
import { TileModel } from "../tileModel.js";
import { Tileset } from "../Tileset.js";

export default class ObjectBase extends TileModel {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.type = Tile.types.NON_SOLID;

        this.tilesetTemplate = Tileset.templates.NONE;

        this.connectivity = Tile.connectTo.NONE;

        this.transparent = true;
        this.requireTool = false;

        this._spriteRenderer.setSpriteSize(48, 48);
    }

    /**
     * Returns true if this type of tile can be mined using a certain tool
     * @override
     * @param {Item} toolItem 
     * @returns {boolean}
     */
    canBeMined(toolItem) {
        if(toolItem && toolItem.placeable)
            return false;

        if(this.requireTool && !Item.isTool(toolItem, this.toolType)) 
            return false;
        
        if(Item.isTool(toolItem, Item.toolTypes.HAMMER)) 
            return false;

        return true;
    }
}