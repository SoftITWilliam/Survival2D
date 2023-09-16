import { sprites } from "../../game/graphics/assets.js";
import { Tile } from "../../tile/Tile.js";
import { TileRegistry as Tiles } from "../../tile/tileRegistry.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemGrassSeeds extends PlaceableBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        
        this.setDefaultSpritePosition(60, 0, 60, 60);
        this.placementPreview = PlacementPreview.fromItem(this, sprites.tiles.tile_grass);
    }

    // Return true if the given position is a dirt block with no block above
    canBePlaced(x, y, world) {
        let tile = world.tiles.get(x, y);
        return (Tile.isTile(tile, Tiles.DIRT) && !world.tiles.get(x, y + 1));
    }

    getPlacedTile() {
        return Tiles.GRASS;
    }
}