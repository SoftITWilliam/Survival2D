import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { isMissingTexture, sprites } from "../game/graphics/assets.js";
import { RARITY_COLORS } from "./rarities.js";
import { TILE_SIZE } from "../game/global.js";
import { World } from "../world/World.js";
import { TileModel } from "../tile/tileModel.js";
import { isPositiveInteger } from "../helper/helper.js";
import { SpriteRenderer } from "../game/graphics/SpriteRenderer.js";

export default class Item {
    constructor(registryName, rarity) {
        this.setSprite(null);

        this._type = Item.types.DEFAULT;
        this.stackSize = 99;
        this.sx = 0;
        this.sy = 0;

        this.sw = TILE_SIZE;
        this.sh = TILE_SIZE;
        
        this._registryname;
        this._rarity;
        this._rarityText;

        this.registryName = registryName;
        this.rarity = rarity;
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

    /**
     * Set sprite offset position
     * (Used for spritesheets)
     * @param {int} offsetX X offset in pixels
     * @param {int} offsetY Y offset in pixels
     */
    setDefaultSpritePosition(offsetX, offsetY, sWidth, sHeight) {
        if(offsetX == null || offsetY == null || this.hasMissingTexture) {
            this.resetSpritePosition();
            return;
        }
        this.sx = offsetX;
        this.sy = offsetY;

        if(sWidth != null) this.sw = sWidth;
        if(sHeight != null) this.sh = sHeight;
    }

    resetSpritePosition() {
        this.sx = 0;
        this.sy = 0;
        this.sw = TILE_SIZE;
        this.sh = TILE_SIZE;
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