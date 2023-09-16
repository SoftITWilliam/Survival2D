import { sprites } from "../../../game/graphics/assets.js";
import PlacementPreview from "../../../ui/placementPreview.js";
import Item from "../../item.js";
import { ItemBase } from "./itemBase.js";

export default class PlaceableBase extends ItemBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.type = Item.types.PLACEABLE;
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = 32;

        this.setDefaultSpritePosition(0, 0, 48, 48);
        this.placementPreview = PlacementPreview.fromItem(this, sprites.misc.missing_texture);
    }

    canBePlaced(x, y, world) {
        return false;
    }

    placeIntoWorld(gridX, gridY, world) {
        try {
            let placeable = this.getPlacedTile();
            if(!this.canBePlaced(gridX, gridY, world)) return false; // Cannot place
            world.setTile(gridX, gridY, placeable);
            return true;
        }
        catch {
            return false;
        }
    }
}