import { TileModel } from "../tileModel.js";
import ObjectBase from "./ObjectBase.js";

export default class PlantBase extends ObjectBase {
    constructor(world, registryName, width, height) {
        super(world, registryName, width, height);
        this.setType("nonSolid");
        this.toolType = "sickle";
    }

    // Remove plant if ground below is broken
    tileUpdate(x,y) {
        if(!this.world.getTile(x, y - 1)) {
            this.breakTile();
        }
    }
}