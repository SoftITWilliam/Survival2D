import { TILE_SIZE } from "../game/global.js";
import { SpriteRenderer } from "../graphics/SpriteRenderer.js";
import { MISSING_TEXTURE, isMissingTexture, sprites } from "../graphics/assets.js";
import { dropItemFromTile } from "../item/dropItem.js";
import Item from "../item/item.js";
import { World } from "../world/World.js";
import { Tile } from "./Tile.js";
import { Tileset } from "./Tileset.js";
import { TileDrop } from "./tileDrop.js";

export class TileModel {
    #type
    constructor(registryName, width = TILE_SIZE, height) {

        /** @type {string} */
        this.registryName = registryName;
        this.w = width;
        this.h = height ?? width;

        this.#type = Tile.types.NONE;
        this.tilesetTemplate = Tileset.templates.DEFAULT;

        /** @type {TileDrop[]} */
        this.tileDrops = [];

        this.connectivity = Tile.connectTo.NONE;

        /** 
         * @protected
         * @type {SpriteRenderer} 
         * */
        this._spriteRenderer = new SpriteRenderer();
        this._spriteRenderer.setSpriteSize(60, 60);

        this.setSprite(null);
    }

    //#region Property getters/setters

    /** @returns {number} */
    get width() { return this.w }

    /** @returns {number} */
    get height() { return this.h }

    get type() {
        return this.#type ?? Tile.types.NONE;
    }

    /** 
     * @param {number} tileType Use Tile.types enum 
     * */
    set type(tileType) {
        if(!Object.values(Tile.types).includes(tileType)) {
            return console.warn("Invalid tile type");
        }
        this.#type = tileType;
    }

    /** @returns {boolean} */
    get hasMissingTexture() {
        return isMissingTexture(this.sprite);
    }

    /** @returns {HTMLImageElement} */
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

    /**
     * Set tile sprite / spritesheet
     * Sprite is loaded asynchronously if it is a Promise
     * @param {(HTMLImageElement | Promise<HTMLImageElement>)} sprite 
     */
    setSprite(sprite) {
        var setSpriteImage = (img) => this._spriteRenderer.setSource(img);

        if(sprite instanceof Promise) 
            sprite.then(result => setSpriteImage(result));

        else if(sprite instanceof Image && sprite.src) 
            setSpriteImage(sprite);
        
        else 
            setSpriteImage(MISSING_TEXTURE);
    }

    /** 
     * TODO Refactor
     * @param {Item} item Held item
     * @param {World} world 
     * @returns {boolean} 
     * */
    canBeMined(item, world) {
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

    /**
     * Loop through this tile's drops and spawn Item entities for each result.
     * Runs when the tile is broken.
     * @param {Tile} tile 
     * @param {(Item | null)} item 
     * @param {World} world 
     */
    dropItems(tile, item, world) {
        this.tileDrops.forEach(tileDrop => {
            const drop = tileDrop.roll(this, item, 1);
            if(drop) {
                dropItemFromTile(tile, drop.item, drop.amount, world.game);
            }
        })
    }

    /**
     * Runs whenever the tile is "refreshed", i.e. something happens to an adjacent tile.
     * @param {Tile} tile 
     * @param {World} world 
     */
    tileUpdate(tile, world) {
        
    }

    /**
     * Runs at a regular interval (not every frame)
     * @param {Tile} tile 
     * @param {World} world 
     */
    tickUpdate(tile, world) {
        
    }

    //#endregion
    //#region Rendering methods

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Tile} tile Tile being rendered
     * @param {number} sheetX Spritesheet position
     * @param {number} sheetY Spritesheet position
     */
    render(ctx, tile, sheetX, sheetY) {
        this._spriteRenderer.setSheetPosition(sheetX, sheetY);
        this._spriteRenderer.render(ctx, tile);
    }

    //#endregion
}