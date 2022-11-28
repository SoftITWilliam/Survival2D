import HammerBase from "./base/hammerItemBase.js";

export class ItemDevHammer extends HammerBase {
    constructor() {
        super();
        this.setRegistryName("dev_hammer");
        this.setRarity(99);

        this.miningLevel = 999;
        this.miningSpeed = 5;
        this.reach = 10;

        this.setSprite();
    }
}