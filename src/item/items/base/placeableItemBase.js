import { ItemBase } from "./itemBase.js";

export default class PlaceableBase extends ItemBase {
    constructor(game,registryName, rarity) {
        super(game,registryName, rarity);
        this.itemType = 'placeable';
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = 32;
    }

    canBePlaced(x,y) {
        return false;
    }
}