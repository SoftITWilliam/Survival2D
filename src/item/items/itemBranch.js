import { sprites } from "../../game/graphics/loadAssets.js";
import ItemBase from "./base/itemBase.js";

export class ItemBranch extends ItemBase {
    constructor(game) {
        super(game);
        this.setRegistryName("branch");
        this.setRarity(0);

        this.setSprite(sprites.items.branch);
    }
}