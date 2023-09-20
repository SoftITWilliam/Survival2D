import { sprites } from "../../graphics/assets.js";
import Item from "../../item/item.js";
import { ItemRegistry } from "../../item/itemRegistry.js";
import WallBase from "../base/WallBase.js";
import { TileDrop } from "../tileDrop.js";

export class DirtWallModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.setSprite(sprites.tilesets.dirt_wall);
        this.setMiningProperties(Item.toolTypes.HAMMER, 0, 0.8, true);

        this.tileDrops = [
            new TileDrop(ItemRegistry.DIRT_WALL),
        ];
    }
}