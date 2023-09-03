import { sprites } from "../../game/graphics/loadAssets.js";
import { TileDrop } from "../tileDrop.js";
import SaplingBase from "../base/SaplingBase.js";
import { toolTypes as tool } from "../../item/itemTypes.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";

export class SaplingModel extends SaplingBase {
    constructor(registryName,) {
        super(registryName);
        this.setSprite(sprites.placeables.sapling);
        this.setMiningProperties(tool.AXE, 0, 0.5, false);

        this.tileDrops = [
            new TileDrop(Items.ACORN).chance(50),
        ];

        this.growthValue = 255;
    }

    draw() {
        this.drawSprite();
    }
}