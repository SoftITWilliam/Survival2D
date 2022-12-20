import { sprites } from "../../loadAssets.js";
import ShovelBase from "./base/shovelItemBase.js";

export class ItemDevShovel extends ShovelBase {
    constructor() {
        super();
        this.setRegistryName("dev_shovel");
        this.setRarity(99);
        
        this.miningLevel = 999;
        this.miningSpeed = 5;
        this.reach = 10;

        this.setSprite(sprites.items.dev_shovel);
    }
}