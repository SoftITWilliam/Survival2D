import { sprites } from "../../game/graphics/loadAssets.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemGrassSeeds extends PlaceableBase {
    constructor(game, registryName, rarity) {
        super(game, registryName, rarity);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_grass, 72, 12, this);
    }

    // Return true if the given position is a dirt block with no block above
    canBePlaced(x, y) {
        let tile = this.game.world.getTile(x, y);
        return (tile && tile.registryName == "dirt" && !this.game.world.getTile(x, y + 1));
    }

    place(x, y) {
        return "grass";
    }
}