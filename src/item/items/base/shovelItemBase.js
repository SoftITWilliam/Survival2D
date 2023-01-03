import Item from "../../../item/item.js";

export default class ShovelBase extends Item {
    constructor(game) {
        super(game);
        this.itemType = 'tool';
        this.toolType = 'shovel';
        this.miningLevel;
        this.miningSpeed;

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 1;
    }
}