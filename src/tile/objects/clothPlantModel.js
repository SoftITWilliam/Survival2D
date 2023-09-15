import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import PlantBase from "../base/PlantBase.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import Item from "../../item/item.js";

export class ClothPlantModel extends PlantBase {
    constructor(registryName) {
        super(registryName, TILE_SIZE);
        this.setSprite(sprites.placeables.cloth_plant);
        this.setMiningProperties(Item.SICKLE, 0, 0.5, false);
        this.transparent = true;
        this.connective = false;

        this.tileDrops = [
            new TileDrop(Items.PLANT_FIBER, 1, 3).affectedByMultipliers(),
            new TileDrop(Items.CLOTH_SEEDS, 1, 2),
        ];
    }
}