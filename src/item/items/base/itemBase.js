import { sprites } from "../../../game/graphics/loadAssets.js";
import Item from "../../../item/item.js";

export class ItemBase extends Item {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        
        this.itemType = 'default';
        this.miningLevel;
        this.miningSpeed;

        this.setRarity(rarity);
        this.setSprite(sprites.items[this.registryName]);

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 99;
    }
}