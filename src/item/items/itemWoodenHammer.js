import { sprites } from "../../game/graphics/loadAssets.js";
import HammerBase from "./base/hammerItemBase.js";

export class ItemWoodenHammer extends HammerBase {
    constructor(game) {
        super(game);
        this.setRegistryName("wooden_hammer");
        this.setRarity(1);

        this.miningLevel = 1;
        this.miningSpeed = 2;
        this.reach = 4;

        this.setSprite(null);
    }
}