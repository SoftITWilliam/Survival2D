import { sprites } from "../../game/graphics/loadAssets.js";
import PlantBase from "../base/plantBase.js";
import TileDrop from "../tileDrop.js";

export class ClothPlant extends PlantBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("plant_cloth");
        this.setSprite(sprites.placeables.cloth_plant);
        this.miningLevel = 0;
        this.miningTime = 0.5;

        this.tileDrops = [
            new TileDrop(this, "plant_fiber", [1,3], 100, true, false),
            new TileDrop(this, "cloth_seeds", [1,2], 100, false, false),
        ];
    }

    draw() {
        this.drawSprite();
    }
}