import { sprites } from "../../game/graphics/loadAssets.js";
import ShovelBase from "./base/shovelItemBase.js";

export class ItemWoodenShovel extends ShovelBase {
    constructor(game) {
        super(game);
        this.setRegistryName("wooden_shovel");
        this.setRarity(1);
        
        this.miningLevel = 1;
        this.miningSpeed = 2;
        this.reach = 4;

        this.setSprite(null);
    }
}