import { sprites } from "../../game/graphics/loadAssets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import { Tile } from "../Tile.js";
import Item from "../../item/item.js";

export class StoneModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.type = Tile.types.SOLID;
        this.setSprite(sprites.tiles.tile_stone);
        this.setMiningProperties(Item.toolTypes.PICKAXE, 1, 3.0, true);

        this.tileDrops = [
            new TileDrop(Items.STONE, true),
        ]
    }
}