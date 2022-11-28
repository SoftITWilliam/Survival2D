import Item from "../../../world/item/item.js";

export default class PickaxeBase extends Item {
    constructor() {
        super();
        this.itemType = 'tool';
        this.toolType = 'pickaxe';
        this.miningLevel;
        this.miningSpeed;

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 1;
    }
}