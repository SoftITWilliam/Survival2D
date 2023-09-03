import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/Tile.js";
import { TileRegistry as Tiles } from "../../tile/tileRegistry.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemClothSeeds extends PlaceableBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.placementPreview = new PlacementPreview(sprites.placeables.cloth_plant, 0, 0, this);
    }

    // Return true if position isn't occupied and tile below is either dirt or grass
    canBePlaced(x, y, world) {
        if(world.outOfBounds(x, y) || world.getTile(x, y)) return false;
        
        let tile = world.getTile(x, y - 1);
        return (Tile.isTile(tile, Tiles.DIRT) || Tile.isTile(tile, Tiles.GRASS));
    }

    place() {
        return Tiles.CLOTH_PLANT;
    }
}