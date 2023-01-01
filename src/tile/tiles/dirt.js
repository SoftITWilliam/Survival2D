import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/tile.js";

export class Dirt extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_dirt");
        this.setSprite(sprites.tiles.tile_dirt);
        
        this.objectType = "solid";
        this.toolType = "shovel";
        this.miningLevel = 0;
        this.miningTime = 1.0;

        this.tileDrops = [
            {id:0,rate:100,amount:1,requireTool:false}
        ];
    }

    draw() {
        this.drawSprite();
    }
}