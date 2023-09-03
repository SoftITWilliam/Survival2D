import Item from "../../item/item.js";
import { toolTypes as tool } from "../../item/itemTypes.js";
import { Tile } from "../Tile.js";
import { TileModel } from "../tileModel.js";

export default class WallBase extends TileModel {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.type = Tile.types.WALL;
        this.setMiningProperties(tool.HAMMER, 0, 1, true);
        this.transparent = false;
        this.connective = true;
    }

    // Override
    canBeMined(item, world) {
        if (item && item.placeable) 
            return false;

        if (world.getTile(this.gridX, this.gridY)?.transparent) 
            return false;

        if (this.requireTool) {
            return Item.isTool(item, tool.HAMMER);
        }

        return true;
    }
}