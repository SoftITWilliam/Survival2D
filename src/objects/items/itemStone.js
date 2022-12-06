import { sprites } from "../../loadAssets.js";
import TileItemBase from "./base/tileItemBase.js";

export class ItemStone extends TileItemBase {
    constructor() {
        super();
        this.setRegistryName("stone");
        this.setRarity(0);

        this.setSprite(sprites.tiles.tile_stone);
        this.setSpriteOffset(192,192);
    }
}