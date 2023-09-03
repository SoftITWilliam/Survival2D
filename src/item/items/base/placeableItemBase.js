import Item from "../../item.js";
import { ItemBase } from "./itemBase.js";

export default class PlaceableBase extends ItemBase {
    constructor(registryName, rarity) {
        super(registryName, rarity);
        this.type = Item.types.PLACEABLE;
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = 32;
    }

    canBePlaced(x, y, world) {
        return false;
    }
}