import { getDisplayName } from "../../lang.js";
import { SPRITES } from "../../loadAssets.js";
import { image } from "../../misc.js";
import { getItemID } from "../registry/itemRegistry.js";

export default class Item {
    constructor() {
        this.itemType = null;
        this.stackSize = 99;
        this.rarity = 0;

        this.setSprite('missing_texture');
        this.sx = 0;
        this.sy = 0;
    }

    setRegistryName(name) {
        this.registryName = name;
        this.setDisplayName();
        this.id = getItemID(name);
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
                this.textColor = "rgb(255,255,255)"; 
                break;

            case 1:
                this.rarityText = "Uncommon";
                this.textColor = "rgb(100,200,120)"; 
                break;

            case 2:
                this.rarityText = "Rare";
                this.textColor = "rgb(80,150,220)";
                break;

            case 3:
                this.rarityText = "Epic";
                this.textColor = "rgb(170,110,255)";
                break;

            case 4:
                this.rarityText = "Legendary";
                this.textColor = "rgb(255,180,0)";
                break;

            case 99:
                this.rarityText = "Unobtainable";
                this.textColor = "rgb(200,30,0"; 
                break;
        }
    }

    setSprite(spriteName) {

        this.missingTexture = false;

        if(spriteName) {
            this.sprite = SPRITES[spriteName];
        } 
        // If no sprite name is given, use registry name
        else {
            this.sprite = SPRITES[this.registryName];
        }
        
        // If texture is missing, use 'missing texture'
        if(!this.sprite) {
            this.sprite = SPRITES["missing_texture"];
            this.missingTexture = true;
        }
    }

    /**
     * Set sprite offset position
     * (Used for spritesheets)
     * 
     * @param {int} offsetX // X offset in pixels
     * @param {int} offsetY // Y offset in pixels
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

