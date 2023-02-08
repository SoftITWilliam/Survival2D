import { sprites } from "../../game/graphics/loadAssets.js";
import TileBase from "../base/tileBase.js";
import { TileDrop } from "../tileDrop.js";

export class Dirt extends TileBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_dirt");
        this.setSprite(sprites.tiles.tile_dirt);
        
        this.toolType = "shovel";
        this.miningLevel = 0;
        this.miningTime = 1.0;

        this.tileDrops = [
            new TileDrop(this, "dirt", 1, 100, false, false),
        ];
    }

    draw() {
        this.drawSprite();
    }
}