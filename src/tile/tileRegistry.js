import * as tile from './tileModelParent.js';

export default class TileRegistry {
    constructor(world) {
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
        ]

        this.enum = {};

        // Assign IDs and set up Enum
        for(let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].id = i;
            this.enum[this.tiles[i].registryName] = i;
        }
    }

    get(tileName) {
        let tile = this.tiles[this.enum[tileName]];
        return tile ? tile : null;
    }
}