import { sprites } from "../../graphics/assets.js";
import Item from "../../item/item.js";
import { ItemRegistry } from "../../item/itemRegistry.js";
import WallBase from "../base/WallBase.js";
import { TileDrop } from "../tileDrop.js";

export class StoneWallModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.setSprite(sprites.walls.stone_wall);
        this.setMiningProperties(Item.toolTypes.HAMMER, 0, 1.5, true);

        this.tileDrops = [
            new TileDrop(ItemRegistry.STONE_WALL),
        ];
    }
}