import { ctx } from "../../game/global.js";
import { toolTypes as tool } from "../../item/itemTypes.js";
import WallBase from "../base/WallBase.js";

export class DirtWallModel extends WallBase {
    constructor(world, registryName) {
        super(world, registryName);
        this.setMiningProperties(tool.HAMMER, 0, 0.8, true);
    }

    // Override
    render(x, y) {
        ctx.fillStyle = "rgb(60,40,30)";
        ctx.fillRect(x, y, this.w, this.h);
    }
}