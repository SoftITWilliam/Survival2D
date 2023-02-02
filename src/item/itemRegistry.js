import * as item from './itemParent.js';

export default class ItemRegistry {
    constructor(game) {
        this.game = game;

        // List of all items in the game
        this.items = [
            new item.Tile(game, "dirt", "Dirt", "COMMON"),                              // ID 0
            new item.Tile(game, "stone", "Stone", "COMMON"),                            // ID 1
            new item.Pickaxe(game, "dev_pickaxe", 999, 5, 10, "UNOBTAINABLE"),          // ID 2
            new item.Axe(game, "dev_axe", 999, 5, 10, "UNOBTAINABLE"),                  // ID 3
            new item.Shovel(game, "dev_shovel", 999, 5, 10, "UNOBTAINABLE"),            // ID 4
            new item.Hammer(game, "dev_hammer", 999, 5, 10, "UNOBTAINABLE"),            // ID 5
            new item.Default(game, "wood", "COMMON"),                                   // ID 6
            new item.Default(game, "branch", "COMMON"),                                 // ID 7
            new item.Acorn(game, "acorn", "COMMON"),                                    // ID 8
            new item.GrassSeeds(game, "grass_seeds", "UNCOMMON"),                       // ID 9
            new item.Default(game, "plant_fiber", "COMMON"),                            // ID 10
            new item.ClothSeeds(game, "cloth_seeds", "COMMON"),                         // ID 11
            new item.Pickaxe(game, "wooden_pickaxe", 1, 2, 4, "UNCOMMON"),              // ID 12
            new item.Axe(game, "wooden_axe", 1, 2, 4, "UNCOMMON"),                      // ID 13
            new item.Shovel(game, "wooden_shovel",1, 2, 4, "UNCOMMON"),                 // ID 14
            new item.Hammer(game, "wooden_hammer", 1, 2, 4, "UNCOMMON"),                // ID 15
        ];

        this.enum = {};

        // Assign IDs and set up Enum
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].id = i;
            this.enum[this.items[i].registryName] = i;
        }

        this.validateItems();
    }

    get(itemName) {
        let item = this.items[this.enum[itemName]];
        return item ? item : null;
    }

    getFromID(id) {
        let item = this.items[id];
        return item ? item : null;
    }

    // Make sure all items have their essential properties. Throw an error if not.
    validateItems() {
        this.items.forEach(item => {
            if(item.id === undefined || item.registryName === undefined || item.rarity === undefined) {
                console.log(item);
                throw new Error("One or more items have invalid properties!");
            }
        })
    }
}