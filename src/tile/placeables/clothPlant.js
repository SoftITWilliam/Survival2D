import { sprites } from "../../game/graphics/loadAssets.js";
import PlantBase from "../base/plantBase.js";

export class ClothPlant extends PlantBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("plant_cloth");
        this.setSprite(sprites.placeables.cloth_plant);

        this.tileDrops = [
            {id:8,rate:50,amount:1,requireTool:false}
        ];
    }

    draw() {
        this.drawSprite();
    }
}