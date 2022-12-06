import { sprites } from "../../loadAssets.js";
import TileItemBase from "./base/tileItemBase.js";

export class ItemDirt extends TileItemBase {
    constructor() {
        super();
        this.setRegistryName("dirt");
        this.setRarity(0);

        this.setSprite(sprites.tiles.tile_dirt);
        this.setSpriteOffset(192,192);
    }
}