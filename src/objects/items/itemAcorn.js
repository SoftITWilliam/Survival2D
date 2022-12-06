import { sprites } from "../../loadAssets.js";
import ItemBase from "./base/itemBase.js";

export class ItemAcorn extends ItemBase {
    constructor() {
        super();
        this.setRegistryName("acorn");
        this.setRarity(0);

        this.setSprite(sprites.items.acorn);
    }
}