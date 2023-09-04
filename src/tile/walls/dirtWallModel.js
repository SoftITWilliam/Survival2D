import { ctx } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import Item from "../../item/item.js";
import WallBase from "../base/WallBase.js";

export class DirtWallModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.setSprite(sprites.tiles.wall_dirt);
        this.setMiningProperties(Item.toolTypes.HAMMER, 0, 0.8, true);
    }
}