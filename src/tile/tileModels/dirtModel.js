import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import TileDrop from "../tileDrop.js";
import { TileModel } from "../tileModel.js";

export class DirtModel extends TileModel {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.tiles.tile_dirt);
        this.setMiningProperties("shovel",0,1.0,false);
        this.setType("solid");

        this.tileDrops = [
            new TileDrop(this, "dirt", 1, 100, false, false),
        ];
    }

    draw() {
        this.drawSprite();
    }
}