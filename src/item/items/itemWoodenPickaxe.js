import { sprites } from "../../game/graphics/loadAssets.js";
import PickaxeBase from "./base/pickaxeItemBase.js";

export class ItemWoodenPickaxe extends PickaxeBase {
    constructor(game) {
        super(game);
        this.setRegistryName("wooden_pickaxe");
        this.setRarity(1);

        this.miningLevel = 1;
        this.miningSpeed = 2;
        this.reach = 4;

        this.setSprite(sprites.items.wooden_pickaxe);
    }
}