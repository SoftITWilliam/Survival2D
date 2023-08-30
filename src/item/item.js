import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { sprites } from "../game/graphics/loadAssets.js";

const ITEM_RARITIES = {
    "COMMON": 0,
    "UNCOMMON": 1,
    "RARE": 2,
    "EPIC": 3,
    "LEGENDARY": 4,
    "UNOBTAINABLE": 99,
}

const RARITY_COLORS = {};

const addRarityColor = (rarityName, rgb) => {
    let r = ITEM_RARITIES[rarityName];
    if(r) RARITY_COLORS[r] = rgb;
}

addRarityColor("COMMON", {r:240, g:240, b:240});
addRarityColor("UNCOMMON", {r:100, g:200, b:120});
addRarityColor("RARE", {r:80, g:150, b:220});
addRarityColor("EPIC", {r:170, g:110, b:255});
addRarityColor("LEGENDARY", {r:255, g:180, b:0});
addRarityColor("UNOBTAINABLE", {r:220, g:0, b:30});

export default class Item {
    constructor(game, registryName) {
        this.game = game; // Pointer
        
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
        let tileBelow = this.game.world.getTile(x, y - 1);
        return (tileBelow && (tileBelow.registryName == "dirt" || tileBelow.registryName == "grass"));
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

