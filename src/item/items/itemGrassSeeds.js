import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/Tile.js";
import { TileRegistry as Tiles } from "../../tile/tileRegistry.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemGrassSeeds extends PlaceableBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_grass, 72, 12, this);
    }

    // Return true if the given position is a dirt block with no block above
    canBePlaced(x, y, world) {
        let tile = world.getTile(x, y);
        return (Tile.isTile(tile, Tiles.DIRT) && !world.getTile(x, y + 1));
    }

    getPlacedTile() {
        return Tiles.GRASS;
    }
}