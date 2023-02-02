import { ctx } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import TileBase from "../base/tileBase.js";
import TileDrop from "../tileDrop.js";

export class Leaves extends TileBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_leaves");
        this.setSprite();
        this.transparent = true;

        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 0.6;

        this.tileDrops = [
            new TileDrop(this, "branch", [1,2], 20, true, false),
            new TileDrop(this, "acorn", 1, 10, true, false),
        ]
    }

    draw() {
        ctx.fillStyle = "rgba(60,150,40,0.8)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}