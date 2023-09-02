import { sprites } from "../../game/graphics/loadAssets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { toolTypes as tool } from "../../item/itemTypes.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";

export class DirtModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.setSprite(sprites.tiles.tile_dirt);
        this.setMiningProperties(tool.SHOVEL, 0, 1.0, false);
        this.setType("solid");

        this.tileDrops = [
            new TileDrop(Items.DIRT),
        ];
    }
}