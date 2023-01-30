import { ctx } from "../../game/global.js";
import WallBase from "../base/wallBase.js";

export class DirtWall extends WallBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("wall_dirt");

        this.miningLevel = 0;
        this.miningTime = 0.8;
    }

    draw() {
        ctx.fillStyle = "rgb(60,40,30)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}