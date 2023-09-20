import * as structures from '../structure/structureParent.js';
import { BASE_TERRAIN_HEIGHT } from "../game/global.js";
import NoiseMap from './NoiseMap.js';
import { Tile } from '../tile/Tile.js';
import { rng, roll } from '../helper/helper.js';
import { TileRegistry, TileRegistry as Tiles } from '../tile/tileRegistry.js';

const worldGenConfig = {

    NOISE_BLUR: 3,

    MIN_DIRT_DEPTH: 2,
    MAX_DIRT_DEPTH: 5,

    // lower = more trees (1 in x)
    TREE_FACTOR: 6, 
    CLOTH_FACTOR: 20,

    // if noise value for a tile is below the threshold, that tile becomes terrain.
    // Higher values result in fewer caves
    TERRAIN_NOISE_THRESHOLD: 53, 
}

export class WorldGeneration {
    constructor(world) {
        this.world = world;

        this.heightmap = null;
        this.terrainNoise = null;
        this.dirtMap = null;
        this.threshold = worldGenConfig.TERRAIN_NOISE_THRESHOLD;
    }

    generate() {
        this.heightmap = this.generateHeightmap();

        this.terrainNoise = new NoiseMap(this.world.width, this.world.height);
        this.terrainNoise.generate(0, 100);
        this.terrainNoise.applyBlur(worldGenConfig.NOISE_BLUR);

        this.dirtMap = this.generateDirtDepth(worldGenConfig.MIN_DIRT_DEPTH, worldGenConfig.MAX_DIRT_DEPTH);

        // Place tiles based on noise
        for(let x = 0; x < this.world.width; x++) {
            for(let y = 0; y < this.world.height; y++) {
                let tile = this.getTerrainTile(x, y, this.terrainNoise.get(x, y));
                let wall = this.getTerrainWall(x, y);
                this.world.tiles.set(x, y, tile);
                this.world.walls.set(x, y, wall);
            }
        }

        this.generateVegetation();
    }

    getTerrainTile(x, y, noiseValue) {
        // No blocks or walls are generated above surface height
        if(y > this.heightmap[x] || noiseValue >= this.threshold) return null;

        let model;

        // Grass
        if(this.heightmap[x] == y) {
            model = TileRegistry.GRASS;
        } 
        
        // Dirt
        else if(this.heightmap[x] - this.dirtMap[x] < y) {
            model = TileRegistry.DIRT;
        } 
        
        // Stone
        else {
            model = TileRegistry.STONE;
        }

        let tile = new Tile(this.world, x, y, model);

        return model ? tile : null;
    }

    getTerrainWall(x, y) {
        // No wall
        if(y > this.heightmap[x]) return null;

        let model = "";

        // Dirt walls
        if(this.heightmap[x] - this.dirtMap[x] <= y) {
            model = TileRegistry.DIRT_WALL;
        } 
        
        // Stone walls
        else {
            model = TileRegistry.STONE_WALL;
        }

        let tile = new Tile(this.world, x, y, model);

        return model ? tile : null;
    }

    /**
     * Return an array of randomized dirth depths, as long as the world is wide.
     * @param {number} minDepth Minimum dirt depth
     * @param {number} maxDepth Maximum dirt depth
     * @returns {Array} 
     */
    generateDirtDepth(minDepth, maxDepth) {
        let dirtDepth = [];
        for(let i = 0; i < this.world.width; i++) {
            dirtDepth.push(rng(minDepth, maxDepth));
        }
        return dirtDepth;
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

        let heightMap = [];
        heightMap.push(Math.ceil(this.world.height / 2));

        for(let x = 0; x < this.world.width; x++) {
            let pHeight = heightMap[x];

            let rand = rng(1, 100);

            //let highThreshold = [5,10,20,40,16,7,2];

            // Down 3: 1%; Down 2: 5%, Down 1: 19%, Equal: 50%, Up 1: 19%, Up 2: 5%, Up 3: 1%
            //let t = [3,10,26,76,92,99];
            let t = [2,7,26,76,95,100];

            let c;
            if(rand >= 1 && rand < t[0]) {
                c = -3;
            } else if(rand >= t[0] && rand < t[1]) {
                c = -2
            } else if(rand >= t[1] && rand < t[2]) {
                c = -1
            } else if(rand >= t[2] && rand < t[3]) {
                c = 0;
            } else if(rand >= t[3] && rand < t[4]) {
                c = 1;
            } else if(rand >= t[4] && rand < t[5]) {
                c = 2;
            } else if(rand >= t[5] && rand <= 100) {
                c = 3;
            }

            heightMap[x + 1] = pHeight + c;
        }

        smoothHeightmap(heightMap);

        return heightMap;
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