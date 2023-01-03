import { ctx } from "../../../game/global.js";
import { Tile } from "../../../tile/tile.js";

export class StoneWall extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("wall_stone");

        this.objectType = "wall";
        this.toolType = "hammer";
        this.miningLevel = 1;
        this.miningTime = 2.0;
    }

    draw() {
        ctx.fillStyle = "rgb(27,27,30)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}