import { TILE_SIZE } from "../game/global.js";
import { SpriteRenderer } from "../graphics/SpriteRenderer.js";
import { sprites } from "../graphics/assets.js";
import { dropItemFromTile } from "../item/dropItem.js";
import Item from "../item/item.js";
import { Tile } from "./Tile.js";
import { Tileset } from "./Tileset.js";

export class TileModel {
    constructor(registryName, width = TILE_SIZE, height) {

        this.registryName = registryName;
        this.w = width;
        this.h = height ?? width;

        this._type = Tile.types.NONE;
        this.tilesetTemplate = Tileset.templates.DEFAULT;

        this.tileDrops = [];

        this._sprite;
        this._spriteRenderer = new SpriteRenderer();
        this._spriteRenderer.setSpriteSize(60, 60);

        this.setSprite(null);
    }

    //#region Property getters/setters

    get width() { return this.w }
    get height() { return this.h }

    get type() {
        return this._type ?? Tile.types.NONE;
    }

    // Use 'Tile.types' enum
    set type(tileType) {
        if(typeof tileType != "number") {
            return console.warn("Invalid tile type");
        }
        this._type = tileType;
    }

    get hasMissingTexture() {
        return isMissingTexture(this.sprite);
    }

    set sprite(img) {
        this._spriteRenderer.setSource(img);
    }

    get sprite() {
        return this._spriteRenderer.source;
    }

    //#endregion

    //#region Getter/setter methods

    /**
     * Set the mining properties of the tile model
     * @param {int} toolType (toolTypes enum) Effective tool type
     * @param {int} toolLevel Which level of tool is required to count as effective
     * @param {number} miningTime How long the tool takes to mine by hand, in seconds
     * @param {boolean} requireTool If a tool is required to mine the tile at all.
     */
    setMiningProperties(toolType, toolLevel, miningTimeSeconds, requireTool) {
        this.toolType = toolType ?? null;
        this.toolLevel = toolLevel;
        this.miningTime = miningTimeSeconds;
        this.requireTool = requireTool;
    }

    // Set the tile sprite.
    setSprite(sprite) {
        if(sprite instanceof Image && sprite.src) 
            this.sprite = sprite;
        else
            this.sprite = sprites.misc["missing_texture"];
    }

    canBeMined() {
        return false;
    }

    //#endregion

    //#region Methods

    // Remove the tile and drop its items.
    breakTile(tile, item = null, world) {
        if(this.type == Tile.types.WALL) {
            world.clearWall(tile.gridX, tile.gridY);
        } else {
            world.clearTile(tile.gridX, tile.gridY);
        }
        
        this.dropItems(tile, (Item.isTool(item) ? item : null), world);

        world.updateNearbyTiles(tile.gridX, tile.gridY);
    }

    // Loop through this tile's drops. Runs when the tile is broken.
    dropItems(tile, item, world) {
        this.tileDrops.forEach(tileDrop => {
            const drop = tileDrop.roll(this, item, 1);
            if(drop) {
                dropItemFromTile(tile, drop.item, drop.amount, world.game);
            }
        })
    }

    // Runs whenever the tile is "refreshed", i.e. something happens to an adjacent tile.
    tileUpdate(tile, world) {
        
    }

    // Runs at a regular interval (not every frame)
    tickUpdate(tile, world) {
        
    }

    //#endregion
    //#region Rendering methods

    render(ctx, tile, sheetX, sheetY) {
        this._spriteRenderer.setSheetPosition(sheetX, sheetY);
        this._spriteRenderer.render(ctx, tile);
    }

    //#endregion
}