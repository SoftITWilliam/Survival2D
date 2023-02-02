import { sprites } from "../../game/graphics/loadAssets.js";
import ItemBase from "./base/itemBase.js";

export class ItemPlantFiber extends ItemBase {
    constructor(game) {
        super(game);
        this.setRegistryName("plant_fiber");
        this.setRarity(0);

        this.setSprite(sprites.items.plant_fiber);
    }
}