import { ITEM_SIZE } from "../../../game/global.js";
import Item from "../../item.js";

export default class PlaceableBase extends Item {
    constructor(game) {
        super(game);
        this.itemType = 'placeable';
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = 32;
    }

    canBePlaced(x,y) {
        return false;
    }
}