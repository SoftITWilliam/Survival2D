import { sprites } from "../../game/graphics/loadAssets.js";
import PlantBase from "../base/plantBase.js";

export class ClothPlant extends PlantBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("plant_cloth");
        this.setSprite(sprites.placeables.cloth_plant);
        this.miningLevel = 0;
        this.miningTime = 0.5;

        this.tileDrops = [
            {id:10,rate:100,amount:[1,3],requireTool:false},
            {id:11,rate:100,amount:[1,2],requireTool:false}
        ];
    }

    draw() {
        this.drawSprite();
    }
}