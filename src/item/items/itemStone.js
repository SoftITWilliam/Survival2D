import { sprites } from "../../game/graphics/loadAssets.js";
import PlacementPreview from "../../ui/placementPreview.js";
import { Stone } from "../../tile/tileParent.js";
import TileItemBase from "./base/tileItemBase.js";

export class ItemStone extends TileItemBase {
    constructor(game) {
        super(game);
        this.setRegistryName("stone");
        this.setRarity(0);

        this.setSprite(sprites.tiles.tile_stone);
        this.setSpriteOffset(192,192);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_stone,this.sx,this.sy,this.game,this);
    }

    place(gridX,gridY) {
        return new Stone(gridX,gridY,this.game.world);
    }
}