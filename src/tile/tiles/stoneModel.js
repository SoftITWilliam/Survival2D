import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import toolTypes from "../../item/toolTypesEnum.js";
import { ItemRegistry } from "../../item/itemRegistry.js";

export class StoneModel extends TileBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.tiles.tile_stone);
        this.setMiningProperties(toolTypes.PICKAXE, 1, 3.0, true);
        this.setType("solid");

        this.tileDrops = [
            new TileDrop(ItemRegistry.STONE, true),
        ]
    }
}