import { sprites } from "../../game/graphics/loadAssets.js";
import ItemBase from "./base/itemBase.js";

export class ItemWood extends ItemBase {
    constructor(game) {
        super(game);
        this.setRegistryName("wood");
        this.setRarity(0);

        this.setSprite(sprites.items.wood);
    }
}