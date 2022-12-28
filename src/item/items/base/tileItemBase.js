import { ITEM_SIZE } from "../../../game/global.js";
import Item from "../../../item/item.js";

export default class TileItemBase extends Item {
    constructor() {
        super();
        this.itemType = 'tile';
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = ITEM_SIZE;
    }
}