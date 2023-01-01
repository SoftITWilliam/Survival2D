import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/tile.js";


export class Stone extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_stone");
        this.setSprite(sprites.tiles.tile_stone);
        
        this.objectType = "solid";

        this.toolType = "pickaxe";
        this.miningLevel = 1;
        this.miningTime = 3.0;
        this.requireTool = true;

        this.tileDrops = [
            {id:1,rate:100,amount:1,requireTool:true}
        ]
    }

    draw() {
        this.drawSprite();
    }
}