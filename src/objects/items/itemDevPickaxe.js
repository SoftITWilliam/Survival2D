import { sprites } from "../../loadAssets.js";
import PickaxeBase from "./base/pickaxeItemBase.js";

export class ItemDevPickaxe extends PickaxeBase {
    constructor() {
        super();
        this.setRegistryName("dev_pickaxe");
        this.setRarity(99);

        this.miningLevel = 999;
        this.miningSpeed = 5;
        this.reach = 10;

        this.setSprite(sprites.items.dev_pickaxe);
    }
}