import { ITEM_SIZE } from "../../../game/global.js";
import Item from "../../../item/item.js";

export default class TileItemBase extends Item {
    constructor(game) {
        super(game);
        this.itemType = 'tile';
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = ITEM_SIZE;
    }
}