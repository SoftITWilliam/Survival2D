import { toolTypes } from "../../item/itemTypes.js";
import ObjectBase from "../base/ObjectBase.js";

export default class PlantBase extends ObjectBase {
    constructor(world, registryName, width, height) {
        super(world, registryName, width, height);
        this.setType("nonSolid");
        this.toolType = toolTypes.SICKLE;
    }

    // Remove plant if ground below is broken
    tileUpdate(tile) {
        if(!this.world.getTile(tile.gridX, tile.gridY - 1)) {
            this.breakTile(tile);
        }
    }
}