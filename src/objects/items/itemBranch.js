import { sprites } from "../../loadAssets.js";
import ItemBase from "./base/itemBase.js";

export class ItemBranch extends ItemBase {
    constructor() {
        super();
        this.setRegistryName("branch");
        this.setRarity(0);

        this.setSprite(sprites.items.branch);
    }
}