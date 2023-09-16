import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { isMissingTexture, sprites } from "../game/graphics/assets.js";
import { RARITY_COLORS } from "./rarities.js";
import { World } from "../world/World.js";
import { TileModel } from "../tile/tileModel.js";
import { isPositiveInteger, validNumbers } from "../helper/helper.js";
import { SpriteRenderer } from "../game/graphics/SpriteRenderer.js";
import { TILE_SIZE } from "../game/global.js";

export default class Item {
    constructor(registryName, rarity) {
        this._type = Item.types.DEFAULT;
        this.stackSize = 99;

        this._registryname;
        this._rarity;
        this._rarityText;

        this._itemRenderer = new SpriteRenderer();
        this._previewRenderer = new SpriteRenderer();

        this._itemRenderer.scaleToFitSize = true;
        this._itemRenderer.setSpriteSize(TILE_SIZE);

        this.registryName = registryName;
        this.rarity = rarity;
        this.setSprite(null);
    }

    //#region Enums

    static types = {
        DEFAULT: 0, // Normal item
        PLACEABLE: 1, // Can be placed. Cannot break tiles when holding. Each item has to specify what they place.
        TILE: 2, // Can be placed. Always places the tile with the same registry name as the item
        TOOL: 3, // Has special effects when used to break tiles.
    }

    static toolTypes = {
        NONE: 0,
        PICKAXE: 1, // Stone-like tiles
        AXE: 2, // Trees & wooden tiles
        SHOVEL: 3, // Dirt-like tiles
        HAMMER: 4, // Walls
        SICKLE: 5, // Currently unused. For plants etc
    }

    //#endregion

    //#region Property getters/setters

    // Set the registry name of the item
    // Also gets item ID, display name, and description
    set registryName(name) {
        this._registryname = name;
        this.displayName = getDisplayName(name);
        this.description = getDescription(this.registryName);
    }

    get registryName() {
        return this._registryname;
    }

    get textColor() {
        return RARITY_COLORS[this.rarity] ?? {r:240, g:240, b:240}
    }

    get type() {
        return this._type;
    }

    /**
     * @param {number} itemType From Item.types enum
     */
    set type(itemType) {
        if(!isPositiveInteger(itemType))
            return console.warn(`Invalid item type (${itemType})`);

        this._type = itemType;
    }

    /**
     * @param {number} value From Rarity enum
     */
    set rarity(value) {
        if(!isPositiveInteger(value))
            return console.warn(`Invalid rarity (${value})`);

        this._rarity = value;
        this._rarityText = getLang("rarity_" + this._rarity);
    }

    get rarity() {
        return this._rarity;
    }

    get rarityText() {
        return this._rarityText;
    }

    get hasMissingTexture() {
        return isMissingTexture(this.sprite);
    }

    get isPlaceable() {
        return (this.type === Item.types.PLACEABLE || this.type === Item.types.TILE);
    }

    //#endregion

    //#region Getter/Setter methods

    /**
     * Set the item sprite. If it doesn't exist, 'missing texture' is used instead.
     * @param {Image} sprite  Sprite image object through 'sprites' import. (ex: 'sprites.item.wood')
     */
    setSprite(sprite) {
        if(sprite instanceof Image && sprite.src) 
            this.sprite = sprite;
        else
            this.sprite = sprites.misc["missing_texture"];

        this._itemRenderer.setSource(this.sprite);
    }

    /** 
     * Return the tile the object is supposed to place.
     * Cannot be a property in the constructor since that causes
     * mutual dependency between ItemRegistry and TileRegistry (which is bad!)
     * @returns {null | TileModel}
    */
    getPlacedTile() { 
        return false;
    }

    setSpritePosition(sx, sy, sWidth, sHeight) {
        this.setItemSpritePosition(sx, sy, sWidth, sHeight);
        if(this.isPlaceable) {
            this.setPreviewSpritePosition(sx, sy, sWidth, sHeight);
        }
    }

    setItemSpritePosition(sx, sy, sWidth, sHeight) {
        if(isPositiveInteger(sx, sy))
            this._itemRenderer.setSourcePosition(sx, sy);

        if(isPositiveInteger(sWidth, sHeight))
            this._itemRenderer.setSpriteSize(sWidth, sHeight);
    }

    setPreviewSpritePosition(sx, sy, sWidth, sHeight) {
        if(isPositiveInteger(sx, sy))
            this._previewRenderer.setSourcePosition(sx, sy);

        if(isPositiveInteger(sWidth, sHeight))
            this._previewRenderer.setSpriteSize(sWidth, sHeight);
    }

    //#endregion

    //#region Methods

    /**
     * (To be overridden by subclasses. It does nothing here.)
     * Try to place a tile at the given coordinates world, 
     * based on the class' getPlacedTile() method
     * @param {number} gridX Grid X coordinate (Positive integer)
     * @param {number} gridY Grid Y coordinate (Positive integer)
     * @param {World} world World object
     * @returns {boolean}
     */
    placeIntoWorld(gridX, gridY, world) { 
        return false; 
    }

    //#endregion

    //#region Rendering methods

    /**
     * Render item in world.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x x coordinate (in pixels)
     * @param {number} y y coordinate (in pixels)
     * @param {number} width Rendering width (in pixels)
     * @param {number} height Rendering height (in pixels)
     */
    render(ctx, x, y, width, height) {
        if(validNumbers(x, y, width, height)) {
            this._itemRenderer.render(ctx, x, y, width, height);
        }
    }

    /**
     * Render item in world.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} centerX Center X coordinate (in pixels)
     * @param {number} centerY Center Y coordinate (in pixels)
     * @param {number} width Rendering width (in pixels)
     * @param {number} height Rendering height (in pixels)
     */
    renderCentered(ctx, centerX, centerY, width, height) {
        if(validNumbers(centerX, centerY, width, height)) {
            this._itemRenderer.renderCentered(ctx, centerX, centerY, width, height);
        }
    }

    //#endregion

    //#region Static methods

    /** 
     * Returns true if 'arg' is of type Item.
     * If parameter 'item' is provided, returns true if 'arg' is the same as 'item'
     * @param {any} arg
     * @param {Item?} item (Optional) Check if 'arg' is the same item as this
    */
    static isItem(arg, item = null) {
        if(arg instanceof Item) {
            return (item instanceof Item) ? (arg.registryName === item.registryName) : true;
        }
        return false;
    }

    static isTool(arg, toolType = null) {
        if(arg instanceof Item && arg.type === Item.types.TOOL) {
            return (toolType !== null) ? (arg.toolType === toolType) : true;
        }
        return false;
    }

    //#endregion
}