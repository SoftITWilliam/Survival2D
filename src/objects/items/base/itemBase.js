import { ITEM_SIZE } from "../../../game/const.js";
import Item from "../../../world/item/item.js";

export default class ItemBase extends Item {
    constructor() {
        super();
        this.itemType = 'tool';
        this.toolType = 'axe';
        this.miningLevel;
        this.miningSpeed;

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 99;
    }
}