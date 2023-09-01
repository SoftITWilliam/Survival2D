import { toolTypes as tool } from "../../item/itemTypes.js";
import { TileModel } from "../tileModel.js";

export default class WallBase extends TileModel {
    constructor(world, registryName, width, height) {
        super(world, registryName, width, height);
        this.setType("wall");
        this.setMiningProperties(tool.HAMMER, 0, 1, true);
        this.transparent = false;
        this.connective = true;
    }

    // Override
    canBeMined(item) {
        if (item && item.placeable) 
            return false;

        if (this.world.getTile(this.gridX, this.gridY) && !this.world.getTile(this.gridX, this.gridY).transparent) 
            return false;

        if (this.requireTool && (!item || item.toolType != tool.HAMMER)) 
            return false;

        return true;
    }
}