import { sprites } from "../../game/graphics/loadAssets.js";
import { BasicTree } from "../../structure/structureParent.js";
import SaplingBase from "../base/saplingBase.js";

export class Sapling extends SaplingBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("placeable_sapling");
        this.setSprite(sprites.placeables.sapling);

        this.tileDrops = [
            {id:8,rate:50,amount:1,requireTool:false}
        ];

        this.tree = new BasicTree(this.gridX,this.gridY,this.world);
        this.growthValue = 2000;
    }

    draw() {
        this.drawSprite();
    }
}