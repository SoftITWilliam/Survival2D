import { getDescription, getDisplayName } from "../../lang.js";
import { sprites } from "../../loadAssets.js";
import { getItemID } from "../registry/itemRegistry.js";

export default class Item {
    constructor() {
        this.setDescription();
        this.itemType = null;
        this.stackSize = 99;
        this.rarity = 0;

        this.setSprite('missing_texture');
        this.sx = 0;
        this.sy = 0;
    }

    setRegistryName(name) {
        this.registryName = name;
        this.id = getItemID(name);
        this.setDisplayName();
        this.setDescription();
    }

    setDescription() {
        this.description = getDescription(this.registryName);
    }

    setDisplayName() {
        this.displayName = getDisplayName(this.registryName);
    }

    /**
     * Set item rarity and display color
     * 
     * @param {int} rarity   Item rarity number 
     */
    setRarity(rarity) {
        this.rarity = rarity;
        switch(rarity) {
            case 0:
                this.rarityText = "Common";
                this.textColor = {r:240,g:240,b:240}; 
                break;

            case 1:
                this.rarityText = "Uncommon";
                this.textColor = {r:100,g:200,b:120};
                break;

            case 2:
                this.rarityText = "Rare";
                this.textColor = {r:80,g:150,b:220};
                break;

            case 3:
                this.rarityText = "Epic";
                this.textColor = {r:170,g:110,b:255};
                break;

            case 4:
                this.rarityText = "Legendary";
                this.textColor = {r:255,g:180,b:0};
                break;

            case 99:
                this.rarityText = "Unobtainable";
                this.textColor = {r:220,g:0,b:30};
                break;
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

