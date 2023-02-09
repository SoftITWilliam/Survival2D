import { ctx } from "../../game/global.js";
import WallBase from "./WallBase.js";

export class StoneWallModel extends WallBase {
    constructor(world, registryName) {
        super(world, registryName);
        this.setMiningProperties("hammer", 0, 1.5, true);
    }

    // Override
    render(x,y) {
        ctx.fillStyle = "rgb(27,27,30)";
        ctx.fillRect(x, y, this.w, this.h);
    }
}