import { ctx } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import Item from "../../item/item.js";
import WallBase from "../base/WallBase.js";

export class StoneWallModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.setSprite(sprites.tiles.wall_stone);
        this.setMiningProperties(Item.toolTypes.HAMMER, 0, 1.5, true);
    }
}