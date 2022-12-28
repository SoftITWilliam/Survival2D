import Item from "../../../item/item.js";

export default class AxeBase extends Item {
    constructor() {
        super();
        this.itemType = 'tool';
        this.toolType = 'axe';
        this.miningLevel;
        this.miningSpeed;

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 1;
    }
}