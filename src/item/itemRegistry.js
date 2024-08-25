import { ToolModule } from '../components/ToolModule.js';
import Item from './item.js';
import * as item from './itemParent.js';

import { ItemRarities as rarity }  from './rarities.js';

const tool = Item.toolTypes;

export class ItemRegistry {

    /* === ITEMS === */

    // Tile items
    static DIRT = new item.Tile("dirt", rarity.COMMON);
    static STONE = new item.Tile("stone", rarity.COMMON);

    // Walls
    static DIRT_WALL = new item.Wall("dirt_wall", rarity.COMMON);
    static STONE_WALL = new item.Wall("stone_wall", rarity.COMMON);

    // Other placeables
    static TORCH = new item.Torch("torch", rarity.COMMON);

    // Dev toolset
    static DEV_PICKAXE = new item.Tool("dev_pickaxe", rarity.UNOBTAINABLE, new ToolModule(tool.PICKAXE, 999, 5, 10));
    static DEV_AXE = new item.Tool("dev_axe", rarity.UNOBTAINABLE, new ToolModule(tool.AXE, 999, 5, 10));
    static DEV_SHOVEL = new item.Tool("dev_shovel", rarity.UNOBTAINABLE, new ToolModule(tool.SHOVEL, 999, 5, 10));
    static DEV_HAMMER = new item.Tool("dev_hammer", rarity.UNOBTAINABLE, new ToolModule(tool.HAMMER, 999, 5, 10));

    // Wooden toolset
    static WOODEN_PICKAXE = new item.Tool("wooden_pickaxe", rarity.UNCOMMON, new ToolModule(tool.PICKAXE, 1, 2, 4))
    static WOODEN_AXE = new item.Tool("wooden_axe", rarity.UNCOMMON, new ToolModule(tool.AXE, 1, 2, 4));
    static WOODEN_SHOVEL = new item.Tool("wooden_shovel", rarity.UNCOMMON, new ToolModule(tool.SHOVEL, 1, 2, 4));
    static WOODEN_HAMMER = new item.Tool("wooden_hammer", rarity.UNCOMMON, new ToolModule(tool.HAMMER, 1, 2, 4));

    // Basic items
    static WOOD = new item.Default("wood", rarity.COMMON);
    static BRANCH = new item.Default("branch", rarity.COMMON);
    static PLANT_FIBER = new item.Default("plant_fiber", rarity.COMMON);
    static COAL = new item.Default("coal", rarity.UNCOMMON);

    // Seeds
    static ACORN = new item.Acorn("acorn", rarity.COMMON);
    static GRASS_SEEDS = new item.GrassSeeds("grass_seeds", rarity.UNCOMMON);
    static CLOTH_SEEDS = new item.ClothSeeds("cloth_seeds", rarity.COMMON);

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
        const itemArray = [];
        for(const key in ItemRegistry) {
            if(ItemRegistry[key] instanceof Item) {
                itemArray.push(ItemRegistry[key]);
            }
        }
        return itemArray;
    }
}