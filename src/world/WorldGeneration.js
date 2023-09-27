import * as structures from '../structure/structureParent.js';
import NoiseMap from './NoiseMap.js';
import { Tile } from '../tile/Tile.js';
import { rng, roll, sum } from '../helper/helper.js';
import { TileRegistry, TileRegistry as Tiles } from '../tile/tileRegistry.js';
import { World } from './World.js';

const worldGenConfig = {

    NOISE_BLUR: 3,

    MIN_DIRT_DEPTH: 0,
    MAX_DIRT_DEPTH: 0,

    // lower = more trees (1 in x)
    TREE_FACTOR: 6, 
    CLOTH_FACTOR: 20,

    // if noise value for a tile is below the threshold, that tile becomes terrain.
    // Higher values result in fewer caves
    TERRAIN_NOISE_THRESHOLD: 53, 

    STEP_CHANCE: [
        [-4, 1],
        [-3, 2],
        [-2, 4],
        [-1, 8],
        [0, 10],
        [1, 8],
        [2, 4],
        [3, 2],
        [4, 1],
    ],

    ENABLE_HEIGHTMAP_SMOOTHING: true,
}

export class WorldGeneration {
    constructor(world) {
        /** @type {World} */
        this.world = world;

        /** @type {number[]} */
        this.heightmap;

        /** @type {NoiseMap} */
        this.terrainNoise;

        /** @type {number[]} */
        this.dirtMap;
    }

    async generate() {
        return new Promise((resolve) => {
            this.world.structures = [];

            this.heightmap = this.generateHeightmap();

            this.terrainNoise = new NoiseMap(this.world.width, this.world.height);
            this.terrainNoise.generate(0, 100);
            this.terrainNoise.applyBlur(worldGenConfig.NOISE_BLUR);

            this.dirtMap = this.generateDirtDepth(worldGenConfig.MIN_DIRT_DEPTH, worldGenConfig.MAX_DIRT_DEPTH);

            // Place tiles based on noise
            for(let x = 0; x < this.world.width; x++) {
                for(let y = 0; y < this.world.height; y++) {
                    if(y > this.heightmap[x]) continue;

                    let tile = this.getTerrainTile(x, y, this.terrainNoise.get(x, y));
                    let wall = this.getTerrainWall(x, y);

                    this.world.tiles.set(x, y, tile);
                    this.world.walls.set(x, y, wall);
                }
            }

            this.generateVegetation();

            resolve();
        })
    }

    getTerrainTile(x, y, noiseValue) {
        // No tile
        if(noiseValue >= worldGenConfig.TERRAIN_NOISE_THRESHOLD) {
            return null;
        }

        // Dirt & Grass
        if(this.heightmap[x] - this.dirtMap[x] < y) {
            if(this.heightmap[x] == y) {
                return new Tile(this.world, x, y, TileRegistry.GRASS);
            } 
            else {
                return new Tile(this.world, x, y, TileRegistry.DIRT);
            }
        } 

        return new Tile(this.world, x, y, TileRegistry.STONE);
    }

    getTerrainWall(x, y) {
        // Dirt wall
        if(this.heightmap[x] - this.dirtMap[x] < y) {
            return new Tile(this.world, x, y, TileRegistry.DIRT_WALL);
        } 
        // Stone wall
        else {
            return new Tile(this.world, x, y, TileRegistry.STONE_WALL);
        }
    }

    /**
     * Return an array of randomized dirth depths, as long as the world is wide.
     * @param {number} minDepth Minimum dirt depth
     * @param {number} maxDepth Maximum dirt depth
     * @returns {Array} 
     */
    generateDirtDepth(minDepth, maxDepth) {
        return new Array(this.world.width).fill(null).map(() => rng(minDepth, maxDepth));
    }

    generateVegetation() {
        let lastTree = -1;
        let treeGap = 2;

        for(let x = 0; x < this.world.width; x++) {
            let y = this.heightmap[x];
            let tile = this.world.tiles.get(x, y);
            
            if(!Tile.isTile(tile, Tiles.GRASS)) continue;

            if(roll(worldGenConfig.TREE_FACTOR) && (x - lastTree) > treeGap) {
                this.world.structures.push(new structures.BasicTree(x, y + 1, this.world));
                lastTree = x;
                continue;
            }

            if(roll(worldGenConfig.CLOTH_FACTOR)) {
                this.world.setTile(x, y + 1, TileRegistry.CLOTH_PLANT);
            }
        }
    }

    generateHeightmap() {

        const heightmap = [];
        heightmap.push(Math.ceil(this.world.height / 2));

        const chanceValues = worldGenConfig.STEP_CHANCE.map(v => v[1]);
        const chanceSum = sum(chanceValues);

        for(let x = 0; x < this.world.width; x++) {
            let previousHeight = heightmap[x];
            
            let rand = rng(0, chanceSum - 1);

            // hopefully I remember how this works later
            let stepHeight = 0;
            for(let i = 0; i < worldGenConfig.STEP_CHANCE.length; i++) {
                rand -= worldGenConfig.STEP_CHANCE[i][1];
                if(rand < 0) {
                    stepHeight = worldGenConfig.STEP_CHANCE[i][0];
                    break;
                } 
            }

            heightmap[x + 1] = previousHeight + stepHeight;
        }

        if(worldGenConfig.ENABLE_HEIGHTMAP_SMOOTHING) {
            smoothHeightmap(heightmap);
        }

        return heightmap;
    }
}

// Remove all tiles from the heightmap that have air on 3 sides
function smoothHeightmap(heightmap) {

    const OUT_OF_BOUNDS = -1;

    for(let x = 0; x < heightmap.length; x++) {
        let height = heightmap[x];
        let heightLeft = x > 0 ? heightmap[x - 1] : OUT_OF_BOUNDS;
        let heightRight = x < heightmap.length - 1 ? heightmap[x + 1] : OUT_OF_BOUNDS;

        let hasTileLeft = (heightLeft >= height || heightLeft === OUT_OF_BOUNDS);
        let hasTileRight = (heightRight >= height || heightRight === OUT_OF_BOUNDS);
        
        if(!hasTileLeft && !hasTileRight) {
            heightmap[x] = Math.max(heightLeft, heightRight);
        }
    }
}