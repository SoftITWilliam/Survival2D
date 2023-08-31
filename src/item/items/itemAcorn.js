import { sprites } from "../../game/graphics/loadAssets.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemAcorn extends PlaceableBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.placementPreview = new PlacementPreview(sprites.placeables.sapling, 0, 0, this);
    }

    // Return true if position isn't occupied and tile below is either dirt or grass
    canBePlaced(x, y, world) {
        return (
            !world.outOfBounds(x, y) && 
            !world.getTile(x, y) && 
            this.canBePlanted(x, y, world)
        );
    }

    place(x, y) {
        return "sapling";
    }
}