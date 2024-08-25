import * as structures from '../structure/structureParent.js';
import NoiseMap from './NoiseMap.js';
import { Tile } from '../tile/Tile.js';
import { getNoiseData, rng, roll, sum } from '../helper/helper.js';
import { TileRegistry, TileRegistry as Tiles } from '../tile/tileRegistry.js';
import { World } from './World.js';
import { Grid } from '../class/Grid.js';
import { TileModel } from '../tile/tileModel.js';
import FastNoiseLite from 'fastnoise-lite';

const SEED_LENGTH = 9;

const GenConfigs = {
    DEFAULT: {
        NOISE_BLUR: 3,
        MIN_DIRT_DEPTH: 2,
        MAX_DIRT_DEPTH: 5,
        TREE_FACTOR: 6, // 1 in x chance of spawning trees (WILL BE REMADE)
        CLOTH_FACTOR: 20, // 1 in x chance of spawning cloth plants (WILL BE REMADE)
        ENABLE_HEIGHTMAP_SMOOTHING: true, // Removes some weird terrain, like random pillars
        STEP_CHANCE: [ // Elevation step chances [tiles, percent]
            [-3, 2],
            [-2, 4],
            [-1, 8],
            [0, 12],
            [1, 8],
            [2, 4],
            [3, 2],
        ],
        NOISE_FREQUENCY: 0.05,
        NOISE_THRESHOLD: 0.7, // Higher values result in fewer caves
    },
    SUPERFLAT: {
        NOISE_BLUR: 3,
        MIN_DIRT_DEPTH: 1,
        MAX_DIRT_DEPTH: 1,
        TREE_FACTOR: 6, 
        CLOTH_FACTOR: 20,
        TERRAIN_NOISE_THRESHOLD: 90, 
        STEP_CHANCE: [[0, 100]],
        ENABLE_HEIGHTMAP_SMOOTHING: false,
    }
};

export class WorldGeneration {
    constructor(world) {
        /** @type {World} */
        this.world = world;

        /** @type {number[]} */
        this.heightmap;

        /** @type {FastNoiseLite} */
        this.terrainNoise;

        /** @type {number[]} */
        this.dirtMap;

        this.config = GenConfigs.DEFAULT;

        this.seed = this.generateSeed();
    }

    generateSeed() {
        let seed = "";
        for(let i = 0; i < SEED_LENGTH; i++) {
            seed += rng(0, 9);
        }
        return parseInt(seed);
    }

    async generate() {
        return new Promise((resolve) => {
            this.world.structures = [];

            //#region | Randomness

            this.heightmap = this.#generateHeightmap();

            if(this.config.ENABLE_HEIGHTMAP_SMOOTHING) {
                this.#smoothHeightmap(this.heightmap);
            }

            this.terrainNoise = new FastNoiseLite();
            this.terrainNoise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
            this.terrainNoise.SetFractalType(FastNoiseLite.FractalType.Ridged);
            this.terrainNoise.SetFrequency(this.config.NOISE_FREQUENCY);        
            this.terrainNoise.SetSeed(this.seed);

            this.dirtMap = this.#generateDirtDepth(this.config.MIN_DIRT_DEPTH, this.config.MAX_DIRT_DEPTH);

            //#endregion
            //#region Pre-defined conditions

            var belowHeightmap = (x, y) => (
                y <= this.heightmap[x]);

            var withinThreshold = (x, y) => (
                this.terrainNoise.GetNoise(x, y) >= this.config.NOISE_THRESHOLD);

            var dirty = (x, y) => (
                y > this.heightmap[x] - this.dirtMap[x]);

            var isATile = (tile) => (
                tile !== null);

            var isSurface = (x, y) => (
                y === this.heightmap[x]);

            //#endregion
            //#region Generation

            // ~~ STONE ~~

            this.fillGridWithTile(
                this.world.tiles, TileRegistry.STONE, 
                (tile, x, y) => belowHeightmap(x, y));

            this.fillGridWithTile(
                this.world.walls, TileRegistry.STONE_WALL, 
                (tile, x, y) => belowHeightmap(x, y));

            // ~~ DIRT ~~

            this.fillGridWithTile(
                this.world.tiles, TileRegistry.DIRT, 
                (tile, x, y) => (belowHeightmap(x, y) && dirty(x, y)));

            this.fillGridWithTile(
                this.world.walls, TileRegistry.DIRT_WALL, 
                (tile, x, y) => (belowHeightmap(x, y) && dirty(x, y)));
    
            // ~~ GRASS ~~

            this.fillGridWithTile(
                this.world.tiles, TileRegistry.GRASS,
                (tile, x, y) => (Tile.isTile(tile, TileRegistry.DIRT) && isSurface(x, y)));

            // ~~ CAVES ~~

            this.fillGridWithTile(
                this.world.tiles, null,
                (tile, x, y) => (belowHeightmap(x, y) && withinThreshold(x, y)));

            this.#generateVegetation();
            this.#generateOres();

            //#endregion

            resolve();
        })
    }

    /**
     * @private
     * @param {Grid} grid 
     * @param {TileModel} model 
     * @param {(value: (Tile|null), x: number, y: number) => boolean} predicate This is called a predicate, thanks zoe <3
     */
    fillGridWithTile(grid, model, predicate = null) {
        
        // To avoid checking the types every time
        let hasCondition = typeof predicate == "function";
        let isModel = model instanceof TileModel;

        grid.eachItem((tile, x, y) => {
            if(hasCondition && predicate(tile, x, y)) {
                return isModel ? new Tile(this.world, x, y, model) : null;
            } 
        })
    }

    /**
     * Return an array of randomized dirth depths, as long as the world is wide.
     * @param {number} minDepth Minimum dirt depth
     * @param {number} maxDepth Maximum dirt depth
     * @returns {Array} 
     */
    #generateDirtDepth(minDepth, maxDepth) {
        return new Array(this.world.width).fill(null).map(() => rng(minDepth, maxDepth));
    }

    #generateVegetation() {
        let lastTree = -1;
        let treeGap = 2;

        for(let x = 0; x < this.world.width; x++) {
            let y = this.heightmap[x];
            let tile = this.world.tiles.get(x, y);
            
            if(!Tile.isTile(tile, Tiles.GRASS)) continue;

            if(roll(this.config.TREE_FACTOR) && (x - lastTree) > treeGap) {
                this.world.structures.push(new structures.BasicTree(x, y + 1, this.world));
                lastTree = x;
                continue;
            }

            if(roll(this.config.CLOTH_FACTOR)) {
                this.world.setTile(x, y + 1, TileRegistry.CLOTH_PLANT);
            }
        }
    }

    #generateOres() {
        const noise = new FastNoiseLite();
        noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
        noise.SetFractalType(FastNoiseLite.FractalType.FBm);
        noise.SetFrequency(0.1);        
        noise.SetSeed(this.seed);

        this.fillGridWithTile(this.world.tiles, TileRegistry.COAL_ORE, (tile, x, y) => {
            return Tile.isTile(tile, TileRegistry.STONE) && noise.GetNoise(x, y) > 0.3
        });
    }

    #generateHeightmap() {

        const heightmap = [];
        heightmap.push(Math.ceil(this.world.height / 2));

        const chanceValues = this.config.STEP_CHANCE.map(v => v[1]);
        const chanceSum = sum(chanceValues);

        for(let x = 0; x < this.world.width; x++) {
            let previousHeight = heightmap[x];
            
            let rand = rng(0, chanceSum - 1);

            // hopefully I remember how this works later
            let stepHeight = 0;
            for(let i = 0; i < this.config.STEP_CHANCE.length; i++) {
                rand -= this.config.STEP_CHANCE[i][1];
                if(rand < 0) {
                    stepHeight = this.config.STEP_CHANCE[i][0];
                    break;
                } 
            }

            heightmap[x + 1] = previousHeight + stepHeight;
        }

        return heightmap;
    }

    #smoothHeightmap(heightmap) {
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
}
