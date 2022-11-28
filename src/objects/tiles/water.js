import { ctx } from "../../game/const.js";
import { Tile } from "../../world/tile/tile.js";

export class Water extends Tile {
    constructor(gridX,gridY) {
        super(gridX,gridY);
        this.setRegistryName("liquid_water");
        
        this.objectType = "liquid";
        this.toolType = false;
        this.miningLevel = false;
    }

    draw() {
        ctx.fillStyle = "rgba(50,80,220,0.8)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}