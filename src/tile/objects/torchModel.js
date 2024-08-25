
import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import Item from "../../item/item.js";
import ObjectBase from "../base/ObjectBase.js";
import { Tile } from "../Tile.js";
import { World } from "../../world/World.js";

export class TorchModel extends ObjectBase {
    constructor(registryName) {
        super(registryName, TILE_SIZE);
        this.setSprite(sprites.placeables.torch);
        this._spriteRenderer.setSpriteSize(60, 60);
        this.setMiningProperties(Item.toolTypes.NONE, 0, 0.5, false);
        this.transparent = true;

        this.setLightEmission(250, 1, { r:255, g:170, b:150 });

        this.tileDrops = [ new TileDrop(Items.TORCH, 1) ];
    }

    /**
     * @param {Tile} tile 
     * @param {World} world 
     */
    tileUpdate(tile, world) {
        // Remove if no valid placement position exists
        const x = tile.gridX;
        const y = tile.gridY;

        const wall = world.walls.get(x, y);

        const tileLeft = world.tiles.get(x - 1, y);
        const tileBelow = world.tiles.get(x, y - 1);
        const tileRight = world.tiles.get(x + 1, y);

        if ((Tile.isTile(tileLeft) && !tileLeft.transparent) || 
            (Tile.isTile(tileRight) && !tileRight.transparent) || 
            (Tile.isTile(tileBelow) && !tileBelow.transparent) || 
            (Tile.isTile(wall) && !wall.transparent))
            return;

        tile.break();
    }
}