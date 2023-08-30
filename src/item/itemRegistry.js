import { ToolModule } from '../components/ToolModule.js';
import Item from './item.js';
import * as item from './itemParent.js';

import { ITEM_RARITIES as rarity }  from './rarities.js';
import toolTypes from './toolTypesEnum.js';

class ItemRegistry {

    /* === ITEMS === */

    // Tile items
    static DIRT = new item.Tile("dirt", rarity.COMMON);
    static STONE = new item.Tile("stone", rarity.COMMON);

    // Dev toolset
    static DEV_PICKAXE = new item.Tool("dev_pickaxe", rarity.UNOBTAINABLE, new ToolModule(toolTypes.PICKAXE, 999, 5, 10));
    static DEV_AXE = new item.Tool("dev_axe", rarity.UNOBTAINABLE, new ToolModule(toolTypes.AXE, 999, 5, 10));
    static DEV_SHOVEL = new item.Tool("dev_shovel", rarity.UNOBTAINABLE, new ToolModule(toolTypes.SHOVEL, 999, 5, 10));
    static DEV_HAMMER = new item.Tool("dev_hammer", rarity.UNOBTAINABLE, new ToolModule(toolTypes.HAMMER, 999, 5, 10));

    // Wooden toolset
    static WOODEN_PICKAXE = new item.Tool("wooden_pickaxe", rarity.UNCOMMON, new ToolModule(toolTypes.PICKAXE, 1, 2, 4))
    static WOODEN_AXE = new item.Tool("wooden_axe", rarity.UNCOMMON, new ToolModule(toolTypes.AXE, 1, 2, 4));
    static WOODEN_SHOVEL = new item.Tool("wooden_shovel", rarity.UNCOMMON, new ToolModule(toolTypes.SHOVEL, 1, 2, 4));
    static WOODEN_HAMMER = new item.Tool("wooden_hammer", rarity.UNCOMMON, new ToolModule(toolTypes.HAMMER, 1, 2, 4));

    // Basic items
    static WOOD = new item.Default("wood", rarity.COMMON);
    static BRANCH = new item.Default("branch", rarity.COMMON);
    static PLANT_FIBER = new item.Default("plant_fiber", rarity.COMMON)

    // Seeds
    static ACORN = new item.Acorn("acorn", rarity.COMMON);
    static GRASS_SEEDS = new item.GrassSeeds("grass_seeds", rarity.UNCOMMON);
    static CLOTH_SEEDS = new item.ClothSeeds("wooden_pickaxe", rarity.COMMON)

    /* === METHODS === */

    /**
     * Returns item matching the registry name.
     * If no item is found, return null.
     * @param {string} registryName Item registry name (ex. "wooden_pickaxe")
     * @returns {Item} 
     */
    static get(registryName) {
        return this.asArray().find(item => (item.registryName === registryName));
    }

    static asArray() {
        return [
            this.DIRT, 
            this.STONE,
            this.DEV_PICKAXE, this.DEV_AXE, this.DEV_SHOVEL, this.DEV_HAMMER,
            this.WOODEN_PICKAXE, this.WOODEN_AXE, this.WOODEN_SHOVEL, this.WOODEN_HAMMER,
            this.WOOD,
            this.BRANCH,
            this.PLANT_FIBER,
            this.ACORN,
            this.GRASS_SEEDS,
            this.CLOTH_SEEDS,
        ];
    }
}

export { ItemRegistry };