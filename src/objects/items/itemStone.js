import { sprites } from "../../loadAssets.js";
import PlacementPreview from "../../player/placementPreview.js";
import { Stone } from "../parents/tileParent.js";
import TileItemBase from "./base/tileItemBase.js";

export class ItemStone extends TileItemBase {
    constructor() {
        super();
        this.setRegistryName("stone");
        this.setRarity(0);

        this.setSprite(sprites.tiles.tile_stone);
        this.setSpriteOffset(192,192);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_stone,this.sx,this.sy);
    }

    place(gridX,gridY) {
        return new Stone(gridX,gridY);
    }
}