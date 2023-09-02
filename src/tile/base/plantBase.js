import { toolTypes } from "../../item/itemTypes.js";
import ObjectBase from "../base/ObjectBase.js";

export default class PlantBase extends ObjectBase {
    constructor(registryName, width, height) {
        super(registryName, width, height);
        this.setType("nonSolid");
        this.toolType = toolTypes.SICKLE;
    }

    // Remove plant if ground below is broken
    tileUpdate(tile, world) {
        if(!world.getTile(tile.gridX, tile.gridY - 1)) {
            this.breakTile(tile, null, world);
        }
    }
}