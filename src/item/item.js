import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { MISSING_TEXTURE, getImageCallback, isMissingTexture, sprites } from "../graphics/assets.js";
import { ItemRarities, RarityColors } from "./rarities.js";
import { World } from "../world/World.js";
import { TileModel } from "../tile/tileModel.js";
import { isPositiveInteger, validNumbers } from "../helper/helper.js";
import { SpriteRenderer } from "../graphics/SpriteRenderer.js";
import { TILE_SIZE } from "../game/global.js";
import { rgb } from "../helper/canvashelper.js";

export default class Item {
    #type
    #registryname
    #rarity
    #rarityText
    constructor(registryName, rarity) {
        this.#type = Item.types.DEFAULT;
        this.stackSize = 99;

        this.#registryname;
        this.#rarity;
        this.#rarityText;

        this.itemRenderer = new SpriteRenderer();
        this.previewRenderer = new SpriteRenderer();

        this.itemRenderer.scaleToFitSize = true;
        this.itemRenderer.setSpriteSize(TILE_SIZE);

        this.registryName = registryName;
        this.rarity = rarity;
        this.setSprite(MISSING_TEXTURE);
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

    /**
     * Set the registry name of the item
     * Also gets item ID, display name, and description
     * @param {string} name
     */
    set registryName(name) {
        this.#registryname = name;
        this.displayName = getDisplayName(name);
        this.description = getDescription(this.registryName);
    }

    /** @returns {string} */
    get registryName() {
        return this.#registryname;
    }

    /** @returns {rgb} */
    get textColor() {
        return RarityColors[this.rarity] ?? {r:240, g:240, b:240}
    }

    get type() {
        return this.#type;
    }

    /**
     * @param {number} itemType From Item.types enum
     */
    set type(itemType) {
        if(!Object.values(Item.types).includes(itemType)) {
            return console.warn(`Invalid item type (${itemType})`);
        }
        this.#type = itemType;
    }

    /**
     * @param {number} value From Rarity enum
     */
    set rarity(value) {
        if(!Object.values(ItemRarities).includes(value)) {
            return console.warn(`Invalid rarity (${value})`);
        }

        this.#rarity = value;
        this.#rarityText = getLang("rarity_" + this.#rarity);
    }
    
    get rarity() {
        return this.#rarity;
    }

    /** @returns {string} */
    get rarityText() {
        return this.#rarityText;
    }

    /** @returns {boolean} */
    get hasMissingTexture() {
        return isMissingTexture(this.sprite);
    }

    /** @returns {boolean} */
    get isPlaceable() {
        return (this.type === Item.types.PLACEABLE || this.type === Item.types.TILE);
    }

    //#endregion

    //#region Getter/Setter methods

    /**
     * Set the item sprite. If it doesn't exist, 'missing texture' is used instead.
     * @param {(HTMLImageElement | Promise<HTMLImageElement>)} image  Sprite image object through 'sprites' import. (ex: 'sprites.item.wood')
     */
    setSprite(image) {
        getImageCallback(image, (result) => this.itemRenderer.setSource(result));
    }
    
    getSprite() {
        return this.itemRenderer.source;
    }

    /** 
     * Return the tile the object is supposed to place.
     * Cannot be a property in the constructor since that causes
     * mutual dependency between ItemRegistry and TileRegistry (which is bad!)
     * @returns {null | TileModel}
    */
    getPlacedTile() { 
        return null;
    }

    setSpritePosition(sx, sy, sWidth, sHeight) {
        this.setItemSpritePosition(sx, sy, sWidth, sHeight);
        if(this.isPlaceable) {
            this.setPreviewSpritePosition(sx, sy, sWidth, sHeight);
        }
    }

    setItemSpritePosition(sx, sy, sWidth, sHeight) {
        if(isPositiveInteger(sx, sy))
            this.itemRenderer.setSourcePosition(sx, sy);

        if(isPositiveInteger(sWidth, sHeight))
            this.itemRenderer.setSpriteSize(sWidth, sHeight);
    }

    setPreviewSpritePosition(sx, sy, sWidth, sHeight) {
        if(isPositiveInteger(sx, sy))
            this.previewRenderer.setSourcePosition(sx, sy);

        if(isPositiveInteger(sWidth, sHeight))
            this.previewRenderer.setSpriteSize(sWidth, sHeight);
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
            this.itemRenderer.render(ctx, x, y, width, height);
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
            this.itemRenderer.renderCentered(ctx, centerX, centerY, width, height);
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