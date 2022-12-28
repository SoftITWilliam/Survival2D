import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/tile.js";

export class Water extends Tile {
    constructor(world,gridX,gridY) {
        super(world,gridX,gridY);
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