import { sprites } from "../../game/graphics/loadAssets.js";
import PlacementPreview from "../../ui/placementPreview.js";
import { Dirt } from "../../tile/tileParent.js";
import TileItemBase from "./base/tileItemBase.js";

export class ItemDirt extends TileItemBase {
    constructor(game) {
        super(game);
        this.setRegistryName("dirt");
        this.setRarity(0);

        this.setSprite(sprites.tiles.tile_dirt);
        
        this.setSpriteOffset(192,192);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_dirt,this.sx,this.sy,this);
    }

    place(gridX,gridY) {
        return new Dirt(gridX,gridY,this.game.world);
    }
}