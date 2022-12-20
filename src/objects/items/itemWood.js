import { sprites } from "../../loadAssets.js";
import ItemBase from "./base/itemBase.js";

export class ItemWood extends ItemBase {
    constructor() {
        super();
        this.setRegistryName("wood");
        this.setRarity(0);

        this.setSprite(sprites.items.wood);
    }
}