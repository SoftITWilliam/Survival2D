import { sprites } from "../../loadAssets.js";
import { Tile } from "../../world/tile/tile.js";


export class Stone extends Tile {
    constructor(gridX,gridY) {
        super(gridX,gridY);
        this.setRegistryName("tile_stone");
        this.setSprite(sprites.tiles.tile_stone);
        
        this.objectType = "solid";

        this.toolType = "pickaxe";
        this.miningLevel = 1;
        this.miningTime = 3.0;
        this.requireTool = true;

        this.tileDrops = [
            {id:2,rate:100,amount:1,requireTool:true}
        ]
    }

    draw() {
        this.drawSprite();
    }
}