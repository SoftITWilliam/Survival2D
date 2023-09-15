import { ITEM_SIZE } from "../../../game/global.js";
import { sprites } from "../../../game/graphics/assets.js";
import { Tile } from "../../../tile/Tile.js";
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

        this.setSprite(sprites.tiles[`tile_${this.registryName}`]);

        /*
            The offset of 192 takes for granted that the tile has a standard spreadsheet,
            and that the spritesheet has a gap of 16 between every sprite.
            This will work for now, though!

            !!! IF A TILE ITEM IS CREATED WHERE THIS IS NOT TRUE, THE SPRITE OFFSET SYSTEM HAS TO BE REWRITTEN.
        */
        this.setSpriteOffset(192,192);

        this.placementPreview = new PlacementPreview(sprites.tiles[`tile_${this.registryName}`], this.sx, this.sy, this);
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