import { sprites } from "../../graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import { Tile } from "../Tile.js";
import Item from "../../item/item.js";

export class CoalOreModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.type = Tile.types.SOLID;
        this.setSprite(sprites.tilesets.coal_ore);
        this.setMiningProperties(Item.toolTypes.PICKAXE, 1, 5.0, true);

        this.tileDrops = [
            new TileDrop(Items.COAL),
        ]
    }
}