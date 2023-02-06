import * as tile from './tileModelParent.js';

export default class TileRegistry {
    constructor(world) {
        this.world = world;

        this.tiles = [
            new tile.Dirt(world, "dirt"),
            new tile.Grass(world, "grass"),
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