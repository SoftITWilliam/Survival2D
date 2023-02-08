



// FIXED IMPORTS:
import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { sprites } from "../game/graphics/loadAssets.js";

export default class Item {
    constructor(game,registryName) {
        this.game = game; // Pointer
        this.setRegistryName(registryName);
        this.setSprite('missing_texture');
        this.itemType = null;
        this.stackSize = 99;
        this.sx = 0;
        this.sy = 0;
    }

    // Set the registry name of the item
    // Also gets item ID, display name, and description
    setRegistryName(name) {
        this.registryName = name;
        this.displayName = getDisplayName(name);
        this.setDescription();
    }

    // Get the item description and assign it to the object
    // Item descriptions are currently stored in lang.js, as "registryname_description"
    setDescription() {
        this.description = getDescription(this.registryName);
    }

    /**
     * Set item rarity and display color
     * 
     * @param {any} rarity   Item rarity (supports both numbers and names, ex. 0 and "COMMON")
     */
    setRarity(rarity) {
        let rarityEnum = {
            "COMMON": 0,
            "UNCOMMON": 1,
            "RARE": 2,
            "EPIC": 3,
            "LEGENDARY": 4,
            "UNOBTAINABLE": 99,
        }

        if(typeof rarity == "number") {
            this.rarity = rarity;
        } else {
            this.rarity = rarityEnum[rarity] ? rarityEnum[rarity] : 0; // Default to 0 if name is invalid
        }
        
        this.rarityText = getLang("rarity_" + this.rarity);
        switch(this.rarity) {
            case 0: this.textColor = {r:240,g:240,b:240}; break;
            case 1: this.textColor = {r:100,g:200,b:120}; break;
            case 2: this.textColor = {r:80,g:150,b:220}; break;
            case 3: this.textColor = {r:170,g:110,b:255}; break;
            case 4: this.textColor = {r:255,g:180,b:0}; break;
            case 99: this.textColor = {r:220,g:0,b:30}; break;
            default: this.textColor = {r:240,g:240,b:240}; break;
        }
    }

    /**
     * Set the item sprite. If it doesn't exist, 'missing texture' is used instead.
     * 
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

    getRegistryName() {
        return this.registryName;
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
    place(gridX,gridY) {
        return;
    }

    /**
     * Return true if the tile below is either dirt or grass
     * @param {number} x X grid position
     * @param {number} y Y grid position
     * @returns 
     */
    canBePlanted(x,y) {
        let tileBelow = this.game.world.getTile(x,y-1);
        if(!tileBelow || (tileBelow.getRegistryName() != "dirt" && tileBelow.getRegistryName() != "grass")) {
            return false;
        }
        return true;
    }

    /**
     * Set sprite offset position
     * (Used for spritesheets)
     * 
     * @param {int} offsetX X offset in pixels
     * @param {int} offsetY Y offset in pixels
     */
    setSpriteOffset(offsetX,offsetY) {
        
        if(!offsetX || !offsetY || this.missingTexture) {
            this.sx = 0;
            this.sy = 0;
        } else {
            this.sx = offsetX;
            this.sy = offsetY;
        }
    }
}

