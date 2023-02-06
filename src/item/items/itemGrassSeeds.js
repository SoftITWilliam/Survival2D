import { sprites } from "../../game/graphics/loadAssets.js";
import { Grass } from "../../tile/tileParent.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemGrassSeeds extends PlaceableBase {
    constructor(game, registryName, rarity) {
        super(game, registryName, rarity);

        this.placementPreview = new PlacementPreview(sprites.tiles.tile_grass,72,12,this);
    }

    // Return true if the given position is a dirt block with no block above
    canBePlaced(x,y) {
        let tile = this.game.world.getTile(x,y);
        if(tile && tile.registryName == "tile_dirt" && !this.game.world.getTile(x,y+1)) {
            return true;
        }
        return false;
    }

    place(x,y) {
        return new Grass(x,y,this.game.world);
    }
}