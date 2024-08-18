import { TileModel } from './tileModel.js';
import * as tile from './tileModelParent.js';

export class TileRegistry {

    /* === TILES === */

    static DIRT = new tile.Dirt("dirt");
    static GRASS = new tile.Grass("grass");
    static STONE = new tile.Stone("stone");
    static COAL_ORE = new tile.CoalOre("coal_ore");
    static DIRT_WALL = new tile.DirtWall("dirt_wall");
    static STONE_WALL = new tile.StoneWall("stone_wall");
    static LOG = new tile.Log("log");
    static LEAVES = new tile.Leaves("leaves");
    static CLOTH_PLANT = new tile.ClothPlant("cloth_plant");
    static SAPLING = new tile.Sapling("sapling");

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
        const tileArray = [];
        for(const key in TileRegistry) {
            if(TileRegistry[key] instanceof TileModel) {
                tileArray.push(TileRegistry[key]);
            }
        }
        return tileArray;
    }
}