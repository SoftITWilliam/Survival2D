import { sprites } from "../../../game/graphics/loadAssets.js";
import Item from "../../item.js";

export class ToolBase extends Item {
    constructor(game,registryName,miningLevel,miningSpeed,reach,rarity) {
        super(game,registryName);
        this.itemType = 'tool';
        
        this.miningLevel = miningLevel;
        this.miningSpeed = miningSpeed;
        this.reach = reach;

        this.setRarity(rarity);
        this.setSprite(sprites.items[this.registryName]);

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 1;
    }
}