import ObjectBase from "../base/ObjectBase.js";

export default class PlantBase extends ObjectBase {
    constructor(world, registryName, width, height) {
        super(world, registryName, width, height);
        this.setType("nonSolid");
        this.toolType = "sickle";
    }

    // Remove plant if ground below is broken
    tileUpdate(tile) {
        if(!this.world.getTile(tile.x, tile.y - 1)) {
            this.breakTile(tile,null,null);
        }
    }
}