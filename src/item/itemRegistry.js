import * as item from './itemParent.js';

const itemRegistry = {
    game: null,
    items: [],
    enum: {},

    initialize: function() {

        // List of all items in the game
        this.items = [
            new item.Tile("dirt", "COMMON"),                                      // ID 0
            new item.Tile("stone", "COMMON"),                                     // ID 1
            new item.Pickaxe("dev_pickaxe", 999, 5, 10, "UNOBTAINABLE"),          // ID 2
            new item.Axe("dev_axe", 999, 5, 10, "UNOBTAINABLE"),                  // ID 3
            new item.Shovel("dev_shovel", 999, 5, 10, "UNOBTAINABLE"),            // ID 4
            new item.Hammer("dev_hammer", 999, 5, 10, "UNOBTAINABLE"),            // ID 5
            new item.Default("wood", "COMMON"),                                   // ID 6
            new item.Default("branch", "COMMON"),                                 // ID 7
            new item.Acorn("acorn", "COMMON"),                                    // ID 8
            new item.GrassSeeds("grass_seeds", "UNCOMMON"),                       // ID 9
            new item.Default("plant_fiber", "COMMON"),                            // ID 10
            new item.ClothSeeds("cloth_seeds", "COMMON"),                         // ID 11
            new item.Pickaxe("wooden_pickaxe", 1, 2, 4, "UNCOMMON"),              // ID 12
            new item.Axe("wooden_axe", 1, 2, 4, "UNCOMMON"),                      // ID 13
            new item.Shovel("wooden_shovel",1, 2, 4, "UNCOMMON"),                 // ID 14
            new item.Hammer("wooden_hammer", 1, 2, 4, "UNCOMMON"),                // ID 15
        ];

        // Assign IDs and set up Enum
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].id = i;
            this.enum[this.items[i].registryName] = i;
        }

        this.validate();
    },

    get: function(itemName) {
        let item = this.items[this.enum[itemName]];
        if(!item) console.warn("itemRegistry.get() warning: invalid item name");
        return item ? item : null;
    },

    getFromId: function(id) {
        let item = this.items[id];
        if(!item) console.warn("itemRegistry.getFromId() warning: invalid id");
        return item ? item : null;
    },
    
    validate: function() {
        this.items.forEach(item => {
            if(item.id === undefined || item.registryName === undefined || item.rarity === undefined) {
                console.log(item);
                throw new Error("One or more items have invalid properties!");
            }
        })
    },
}

export default itemRegistry;