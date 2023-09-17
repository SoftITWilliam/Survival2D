import { sprites } from "../../graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import SaplingBase from "../base/SaplingBase.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import Item from "../../item/item.js";

export class SaplingModel extends SaplingBase {
    constructor(registryName,) {
        super(registryName);
        this.setSprite(sprites.placeables.sapling);
        this.setMiningProperties(Item.toolTypes.AXE, 0, 0.5, false);

        this.tileDrops = [
            new TileDrop(Items.ACORN).chance(50),
        ];

        this.growthValue = 255;
    }

    draw() {
        this.drawSprite();
    }
}