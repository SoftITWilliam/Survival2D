import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../graphics/assets.js";
import { Tile } from "../../tile/Tile.js";
import { TileRegistry as Tiles } from "../../tile/tileRegistry.js";
import PlacementPreview from "../../ui/placementPreview.js";
import { World } from "../../world/World.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemTorch extends PlaceableBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        
        this.setItemSpritePosition(0, 0, TILE_SIZE, TILE_SIZE);
        this.setPreviewSpritePosition(0, 0, 60, 60);
        this.previewRenderer.setSource(sprites.placeables.torch);
        this.placementPreview = new PlacementPreview(this, this.previewRenderer);
    }

    /**
     * Return true if there is a tile next to or below the current tile,
     * or if placed on a wall.
     * @param {number} x 
     * @param {number} y 
     * @param {World} world 
     * @returns {boolean}
     */
    canBePlaced(x, y, world) {
        const tile = world.tiles.get(x, y);
        const wall = world.walls.get(x, y);

        const tileLeft = world.tiles.get(x - 1, y);
        const tileBelow = world.tiles.get(x, y - 1);
        const tileRight = world.tiles.get(x + 1, y);

        return !Tile.isTile(tile) && (
               (Tile.isTile(tileLeft) && !tileLeft.transparent) || 
               (Tile.isTile(tileRight) && !tileRight.transparent) || 
               (Tile.isTile(tileBelow) && !tileBelow.transparent) || 
               (Tile.isTile(wall) && !wall.transparent));
    }

    getPlacedTile() {
        return Tiles.TORCH;
    }
}