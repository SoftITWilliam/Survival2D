import { sprites } from "../../game/graphics/loadAssets.js";
import { BasicTree } from "../../structure/structureParent.js";
import { TileDrop } from "../tileDrop.js";
import SaplingBase from "./SaplingBase.js";

export class Sapling extends SaplingBase {
    constructor(world, registryName,) {
        super(world, registryName);
        this.setSprite(sprites.placeables.sapling);

        this.tileDrops = [
            new TileDrop(this, "acorn", 1, 50, false, false),
        ];

        this.tree = new BasicTree(this.gridX,this.gridY,this.world);
        this.growthValue = 2000;
    }

    draw() {
        this.drawSprite();
    }
}