import { ctx } from "../../game/global.js";
import Item from "../../item/item.js";
import WallBase from "../base/WallBase.js";

export class StoneWallModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.setMiningProperties(Item.toolTypes.HAMMER, 0, 1.5, true);
    }

    // Override
    render(x, y) {
        ctx.fillStyle = "rgb(27,27,30)";
        ctx.fillRect(x, y, this.w, this.h);
    }
}