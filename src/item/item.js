



// FIXED IMPORTS:
import { getDescription, getDisplayName, getLang } from "../game/lang.js";
import { sprites } from "../game/graphics/loadAssets.js";
import { getItemID } from "./itemRegistry.js";

export default class Item {
    constructor() {
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
        this.displayName = getDisplayName(this.registryName);
        this.id = getItemID(name);
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
     * @param {int} rarity   Item rarity number 
     */
    setRarity(rarity) {
        this.rarity = rarity;
        this.rarityText = getLang("rarity_" + rarity);
        switch(rarity) {
            case 0: this.textColor = {r:240,g:240,b:240}; break;
            case 1: this.textColor = {r:100,g:200,b:120}; break;
            case 2: this.textColor = {r:80,g:150,b:220}; break;
            case 3: this.textColor = {r:170,g:110,b:255}; break;
            case 4: this.textColor = {r:255,g:180,b:0}; break;
            case 99: this.textColor = {r:220,g:0,b:30}; break;
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

    /** 
     * Return the tile the object is supposed to place.
    */
    place(gridX,gridY) {
        return;
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

