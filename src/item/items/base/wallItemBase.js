import { ITEM_SIZE } from "../../../game/global.js";
import { sprites } from "../../../game/graphics/assets.js";
import { Tile } from "../../../tile/Tile.js";
import { TileModel } from "../../../tile/tileModel.js";
import { TileRegistry as Tiles } from "../../../tile/tileRegistry.js";
import PlacementPreview from "../../../ui/placementPreview.js";
import Item from "../../item.js";
import { ItemRegistry } from "../../itemRegistry.js";
import { ItemBase } from "./itemBase.js";

export class WallItemBase extends ItemBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.type = Item.types.TILE;
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = ITEM_SIZE * 2;
        
        this.setDefaultSpritePosition(72, 72, 60, 60);

        const spritesheet = sprites.walls[this.registryName];
        this.setSprite(spritesheet);
        this.placementPreview = PlacementPreview.fromItem(this, spritesheet);
    }

    // Return true if position has no tile, is adjacent to another time or on top of a wall.
    canBePlaced(x, y, world) {
        if(world.outOfBounds(x, y)) return false;

        let existingWall = world.walls.get(x, y);
        if(Tile.isTile(existingWall, this.getPlacedTile()));

        let hasAdjacentWall = (
            world.walls.get(x - 1, y) ||
            world.walls.get(x, y + 1) ||
            world.walls.get(x + 1, y) ||
            world.walls.get(x, y - 1)
        );
        let hasAdjacentTile = (
            world.tiles.get(x - 1, y) ||
            world.tiles.get(x, y + 1) ||
            world.tiles.get(x + 1, y) ||
            world.tiles.get(x, y - 1) ||
            world.tiles.get(x, y)
        );

        return (hasAdjacentTile || hasAdjacentWall);
    }

    getPlacedTile() {
        let wall = Tiles.get(this.registryName);
        return (wall instanceof TileModel ? wall : null);
    }

    placeIntoWorld(gridX, gridY, world) {
        try {
            let wall = this.getPlacedTile();

            if(wall == null || world.outOfBounds(gridX, gridY)) return false; // Cannot place
            
            let existingWall = world.walls.get(gridX, gridY);

            // Replace existing wall
            if(Tile.isTile(existingWall)) {
                if(Tile.isTile(existingWall, wall)) return false; // Trying to replace wall of same type

                // PLACEHOLDER!!!! (todo: Use hammer in inventory)
                let tool = ItemRegistry.DEV_HAMMER;
                existingWall.breakTile(tool);
            }

            world.setWall(gridX, gridY, wall);
            return true;
        }
        catch {
            return false;
        }
    }
}