import * as tile from './tileModelParent.js';

const tileRegistry = {
    world: null,
    tiles: [],
    enum: {},

    initialize: function(world) {
        this.world = world;

        this.tiles = [
            new tile.Dirt(world, "dirt"),
            new tile.Grass(world, "grass"),
            new tile.Stone(world, "stone"),
            new tile.DirtWall(world, "dirt_wall"),
            new tile.StoneWall(world, "stone_wall"),
            new tile.Log(world, "log"),
            new tile.Leaves(world, "leaves"),
            new tile.ClothPlant(world, "cloth_plant"),
            new tile.Sapling(world, "sapling"),
        ]

        this.enum = {};

        // Assign IDs and set up Enum
        for(let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].id = i;
            this.enum[this.tiles[i].registryName] = i;
        }
    },

    get: function(tileName) {
        let tile = this.tiles[this.enum[tileName]];
        if(!tile) console.warn("tileRegistry.get() warning: invalid tile name");
        return tile ? tile : null;
    }
}

export default tileRegistry;