import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import { TileDrop } from "../tileDrop.js";
import PlantBase from "../base/PlantBase.js";
import toolTypes from "../../item/toolTypesEnum.js";
import { ItemRegistry } from "../../item/itemRegistry.js";

export class ClothPlantModel extends PlantBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.placeables.cloth_plant);
        this.setMiningProperties(toolTypes.SICKLE, 0, 0.5, false);
        this.transparent = true;
        this.connective = false;

        this.tileDrops = [
            new TileDrop(ItemRegistry.PLANT_FIBER, 1, 3).affectedByMultipliers(),
            new TileDrop(ItemRegistry.CLOTH_SEEDS, 1, 2),
        ];
    }
}