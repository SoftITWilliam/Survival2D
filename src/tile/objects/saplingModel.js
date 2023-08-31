import { sprites } from "../../game/graphics/loadAssets.js";
import { BasicTree } from "../../structure/structureParent.js";
import { TileDrop } from "../tileDrop.js";
import SaplingBase from "../base/SaplingBase.js";
import toolTypes from "../../item/toolTypesEnum.js";
import { ItemRegistry } from "../../item/itemRegistry.js";

export class SaplingModel extends SaplingBase {
    constructor(world, registryName,) {
        super(world, registryName);
        this.setSprite(sprites.placeables.sapling);
        this.setMiningProperties(toolTypes.NONE, 0, 0.5, false);

        this.tileDrops = [
            new TileDrop(ItemRegistry.ACORN).chance(50),
        ];

        this.tree = new BasicTree(0, 0, this.world);
        this.growthValue = 255;
    }

    draw() {
        this.drawSprite();
    }
}