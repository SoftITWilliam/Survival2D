import { ctx } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/tile.js";


export class Leaves extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_leaves");
        this.setSprite();
        this.objectType = "solid";
        this.transparent = true;

        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 0.6;

        this.tileDrops = [
            {id:7,rate:16,amount:1,requireTool:false},
            {id:8,rate:8,amount:1,requireTool:false}
        ]
    }

    draw() {
        ctx.fillStyle = "rgba(60,150,40,0.8)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}