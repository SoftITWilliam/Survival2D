import PlaceableBase from "./placeableBase.js";

export default class PlantBase extends PlaceableBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.objectType = "nonSolid";
        this.toolType = "sickle";
    }

    // Remove plant if ground below is broken
    tileUpdate() {
        if(!this.world.getTile(this.gridX, this.gridY - 1)) {
            this.breakTile();
        }
    }
}