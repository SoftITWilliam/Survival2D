import { ctx, TILE_SIZE } from "../../game/const.js";
import { sprites } from "../../loadAssets.js";
import { image, setAttributes } from "../../misc.js";
import { Tile } from "../../world/tile/tile.js";

export class Dirt extends Tile {
    constructor(gridX,gridY) {
        super(gridX,gridY);
        this.setRegistryName("tile_dirt");
        this.setSprite(sprites.tiles.tile_dirt);
        
        this.objectType = "solid";
        this.toolType = "shovel";
        this.miningLevel = 0;
        this.miningTime = 1.0;

        this.tileDrops = [
            {id:1,rate:100,amount:1,requireTool:false}
        ];
    }

    draw() {
        this.drawSprite();
    }
}