import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { sprites } from "../game/graphics/loadAssets.js";
import { ITEM_RARITIES, RARITY_COLORS } from "./rarities.js";

export default class Item {
    constructor(registryName) {
        this.setSprite('missing_texture');
        this.itemType = null;
        this.stackSize = 99;
        this.sx = 0;
        this.sy = 0;
        
        this._registryname;

        this.registryName = registryName;
    }

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

    /**
     * Set item rarity and display color
     * @param {any} rarity   Item rarity (supports both numbers and names, ex. 0 and "COMMON")
     */
    setRarity(rarity) {
        this.rarity = ITEM_RARITIES[rarity] ?? 0;
        this.rarityText = getLang("rarity_" + this.rarity);
    }

    /**
     * Set the item sprite. If it doesn't exist, 'missing texture' is used instead.
     * @param {any} sprite  Sprite image object through 'sprites' import. (ex: 'sprites.item.wood')
     */
    setSprite(sprite) {
    
        this.sprite = sprite;
        
        // If texture is missing, use 'missing texture'
        if(!this.sprite) {
            this.sprite = sprites.misc["missing_texture"];
            this.missingTexture = true;
        } else {
            this.missingTexture = false;
        }
    }

    getDisplayName() {
        return this.displayName;
    }

    getDescription() {
        return this.description;
    }

    /** 
     * Return the tile the object is supposed to place.
    */
    place(gridX, gridY) {
        return;
    }

    /**
     * Return true if the tile below is either dirt or grass
     * @param {number} x X grid position
     * @param {number} y Y grid position
     * @returns 
     */
    canBePlanted(x, y) {
        /*
        let tileBelow = this.game.world.getTile(x, y - 1);
        return (tileBelow && (tileBelow.registryName == "dirt" || tileBelow.registryName == "grass"));
        */
       return false;
    }

    /**
     * Set sprite offset position
     * (Used for spritesheets)
     * @param {int} offsetX X offset in pixels
     * @param {int} offsetY Y offset in pixels
     */
    setSpriteOffset(offsetX, offsetY) {
        
        if(!offsetX || !offsetY || this.missingTexture) {
            this.sx = 0;
            this.sy = 0;
        } else {
            this.sx = offsetX;
            this.sy = offsetY;
        }
    }
}

