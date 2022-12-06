import { ctx } from "../../game/const.js";
import { sprites } from "../../loadAssets.js";
import { Tile } from "../../world/tile/tile.js";


export class Leaves extends Tile {
    constructor(gridX,gridY) {
        super(gridX,gridY);
        this.setRegistryName("tile_leaves");
        this.setSprite();
        this.objectType = "solid";
        this.transparent = true;

        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 0.6;

        this.tileDrops = [
            {id:8,rate:16,amount:1,requireTool:false},
            {id:9,rate:8,amount:1,requireTool:false}
        ]
    }

    draw() {
        ctx.fillStyle = "rgba(60,150,40,0.8)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}