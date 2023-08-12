import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import { SelfDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import toolTypes from "../../item/toolTypesEnum.js";

export class DirtModel extends TileBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.tiles.tile_dirt);
        this.setMiningProperties(toolTypes.SHOVEL, 0, 1.0, false);
        this.setType("solid");

        this.tileDrops = [
            new SelfDrop(this, false),
        ];
    }
}