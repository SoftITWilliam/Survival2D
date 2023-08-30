import { ITEM_SIZE } from "../../../game/global.js";
import { sprites } from "../../../game/graphics/loadAssets.js";
import PlacementPreview from "../../../ui/placementPreview.js";
import { ItemBase } from "./itemBase.js";

export class TileItemBase extends ItemBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.itemType = 'tile';
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
        if(world.outOfBounds(x, y) || world.getTile(x, y)) { return false } 

        return (
            world.getTile(x - 1, y) ||
            world.getTile(x, y + 1) ||
            world.getTile(x + 1, y) ||
            world.getTile(x, y - 1) ||
            world.getWall(x, y)
        );
    }

    place() {
        return this.registryName;
    }
}