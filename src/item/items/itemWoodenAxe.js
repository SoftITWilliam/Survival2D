import { sprites } from "../../game/graphics/loadAssets.js";
import AxeBase from "./base/axeItemBase.js";

export class ItemWoodenAxe extends AxeBase {
    constructor(game) {
        super(game);
        this.setRegistryName("wooden_axe");
        this.setRarity(1);

        this.miningLevel = 1;
        this.miningSpeed = 2;
        this.reach = 4;

        this.setSprite(sprites.items.wooden_axe);
    }
}