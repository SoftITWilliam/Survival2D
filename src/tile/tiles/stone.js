import { sprites } from "../../game/graphics/loadAssets.js";
import TileBase from "../base/tileBase.js";

export class Stone extends TileBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_stone");
        this.setSprite(sprites.tiles.tile_stone);

        this.toolType = "pickaxe";
        this.miningLevel = 1;
        this.miningTime = 3.0;

        this.tileDrops = [
            {id:1,rate:100,amount:1,requireTool:true}
        ]
    }

    draw() {
        this.drawSprite();
    }
}