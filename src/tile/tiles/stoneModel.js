import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import { SelfDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";

export class StoneModel extends TileBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.tiles.tile_stone);
        this.setMiningProperties("pickaxe", 1, 3.0, true);
        this.setType("solid");

        this.tileDrops = [
            new SelfDrop(this, false),
        ]
    }
}