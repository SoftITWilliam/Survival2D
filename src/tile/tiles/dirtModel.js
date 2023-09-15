import { sprites } from "../../game/graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import { Tile } from "../Tile.js";
import Item from "../../item/item.js";

export class DirtModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.type = Tile.types.SOLID;
        this.setSprite(sprites.tiles.tile_dirt);
        this.setMiningProperties(Item.toolTypes.SHOVEL, 0, 1.0, false);

        this.tileDrops = [
            new TileDrop(Items.DIRT),
        ];
    }
}