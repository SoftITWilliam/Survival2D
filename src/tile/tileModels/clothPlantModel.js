import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import TileDrop from "../tileDrop.js";
import PlantBase from "./PlantBase.js";

export class ClothPlantModel extends PlantBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.placeables.cloth_plant);
        this.setMiningProperties("sickle", 0, 0.5, false);
        this.transparent = true;
        this.connective = false;

        this.tileDrops = [
            new TileDrop(this, "plant_fiber", [1,3], 100, true, false),
            new TileDrop(this, "cloth_seeds", [1,2], 100, false, false),
        ];
    }
}