import Item from "../../../item/item.js";

export default class PickaxeBase extends Item {
    constructor(game) {
        super(game);
        this.itemType = 'tool';
        this.toolType = 'pickaxe';
        this.miningLevel;
        this.miningSpeed;

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 1;
    }
}