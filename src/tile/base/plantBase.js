import Item from "../../item/item.js";
import { Tile } from "../Tile.js";
import ObjectBase from "../base/ObjectBase.js";

export default class PlantBase extends ObjectBase {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.type = Tile.types.NON_SOLID;
        this.toolType = Item.toolTypes.SICKLE;
    }

    // Remove plant if ground below is broken
    tileUpdate(tile, world) {
        if(!world.tiles.get(tile.gridX, tile.gridY - 1)) {
            this.breakTile(tile, null, world);
        }
    }
}