import { TILE_SIZE } from "../../../game/global.js";
import { SpriteRenderer } from "../../../graphics/SpriteRenderer.js";
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

        this.previewRenderer = new SpriteRenderer();
        this.previewRenderer.setSpriteSize(TILE_SIZE);
        this.itemRenderer.setSpriteSize(TILE_SIZE);

        this.placementPreview = new PlacementPreview(this, this.previewRenderer);
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