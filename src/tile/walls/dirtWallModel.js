import { sprites } from "../../game/graphics/loadAssets.js";
import Item from "../../item/item.js";
import WallBase from "../base/WallBase.js";

export class DirtWallModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.setSprite(sprites.walls.dirt_wall);
        this.setMiningProperties(Item.toolTypes.HAMMER, 0, 0.8, true);
    }
}