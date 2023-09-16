import { ITEM_SIZE } from "../../../game/global.js";
import { SpriteRenderer } from "../../../game/graphics/SpriteRenderer.js";
import { sprites } from "../../../game/graphics/assets.js";
import { TileModel } from "../../../tile/tileModel.js";
import { TileRegistry as Tiles } from "../../../tile/tileRegistry.js";
import PlacementPreview from "../../../ui/placementPreview.js";
import Item from "../../item.js";
import { ItemBase } from "./itemBase.js";

export class TileItemBase extends ItemBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.type = Item.types.TILE;
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = ITEM_SIZE;

        const spritesheet = sprites.tiles[`tile_${this.registryName}`];

        this.setSprite(spritesheet);

        this._previewRenderer.setSource(spritesheet);
        this.setSpritePosition(180, 180, 60, 60);
        this.placementPreview = new PlacementPreview(this, this._previewRenderer);
    }

    // Return true if position has no tile, is adjacent to another time or on top of a wall.
    canBePlaced(x, y, world) {
        if(world.outOfBounds(x, y) || world.tiles.get(x, y)) { return false } 

        return (
            world.tiles.get(x - 1, y) ||
            world.tiles.get(x, y + 1) ||
            world.tiles.get(x + 1, y) ||
            world.tiles.get(x, y - 1) ||
            world.walls.get(x, y)
        );
    }

    getPlacedTile() {
        let tile = Tiles.get(this.registryName);
        return (tile instanceof TileModel ? tile : null);
    }

    placeIntoWorld(gridX, gridY, world) {
        try {
            let tile = this.getPlacedTile();
            if(tile == null || world.outOfBounds(gridX, gridY)) return false; // Cannot place
            
            if(world.tiles.get(gridX, gridY)) return false; // Already has tile

            world.setTile(gridX, gridY, tile);

            return true;
        }
        catch {
            return false;
        }
    }
}