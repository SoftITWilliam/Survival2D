import * as item from './itemParent.js';

export default class ItemRegistry {
    constructor(game) {
        console.log(game);
        this.game = game;

        this.enum = {
            dirt:               0,
            stone:              1,
            dev_pickaxe:        2,
            dev_shovel:         3,
            dev_axe:            4,
            dev_hammer:         5,
            wood:               6,
            branch:             7,
            acorn:              8,
            grass_seeds:        9,
            plant_fiber:        10,
            cloth_seeds:        11,
        };

        this.items = [
            new item.Dirt(game), // ID 0
            new item.Stone(game), // ID 1
            new item.DevPickaxe(game), // ID 2
            new item.DevAxe(game), // ID 3
            new item.DevShovel(game), // ID 4
            new item.DevHammer(game), // ID 5
            new item.Wood(game), // ID 6
            new item.Branch(game), // ID 7
            new item.Acorn(game), // ID 8
            new item.GrassSeeds(game), // ID 9
            new item.PlantFiber(game), // ID 10
            new item.ClothSeeds(game), // ID 11
        ];

        this.items.forEach(item => {
            item.id = this.enum[item.registryName];
        });

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
            console.log(item);
            if(item.id === undefined || item.registryName === undefined || item.rarity === undefined) {
                throw new Error("One or more items have invalid properties!");
            }
        })
    }
}