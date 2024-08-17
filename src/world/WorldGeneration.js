import * as structures from '../structure/structureParent.js';
import NoiseMap from './NoiseMap.js';
import { Tile } from '../tile/Tile.js';
import { rng, roll, sum } from '../helper/helper.js';
import { TileRegistry, TileRegistry as Tiles } from '../tile/tileRegistry.js';
import { World } from './World.js';
import { Grid } from '../class/Grid.js';
import { TileModel } from '../tile/tileModel.js';

const GenConfigs = {
    DEFAULT: {
        NOISE_BLUR: 3,
        MIN_DIRT_DEPTH: 2,
        MAX_DIRT_DEPTH: 5,
        TREE_FACTOR: 6, // 1 in x chance of spawning trees (WILL BE REMADE)
        CLOTH_FACTOR: 20, // 1 in x chance of spawning cloth plants (WILL BE REMADE)
        TERRAIN_NOISE_THRESHOLD: 53, // Higher values result in fewer caves
        ENABLE_HEIGHTMAP_SMOOTHING: true, // Removes some weird terrain, like random pillars
        STEP_CHANCE: [ // Elevation step chances [tiles, percent]
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

        /** @type {NoiseMap} */
        this.terrainNoise;

        /** @type {number[]} */
        this.dirtMap;

        this.config = GenConfigs.SUPERFLAT;
    }

    async generate() {
        return new Promise((resolve) => {
            this.world.structures = [];

            //#region | Randomness

            this.heightmap = this.#generateHeightmap();

            if(this.config.ENABLE_HEIGHTMAP_SMOOTHING) {
                this.#smoothHeightmap(this.heightmap);
            }

            this.terrainNoise = new NoiseMap(this.world.width, this.world.height);
            this.terrainNoise.generate(0, 100);
            this.terrainNoise.applyBlur(this.config.NOISE_BLUR);

            this.dirtMap = this.#generateDirtDepth(this.config.MIN_DIRT_DEPTH, this.config.MAX_DIRT_DEPTH);

            //#endregion
            //#region Pre-defined conditions

            var belowHeightmap = (x, y) => (
                y <= this.heightmap[x]);

            var withinThreshold = (x, y) => (
                this.terrainNoise.get(x, y) >= this.config.TERRAIN_NOISE_THRESHOLD);

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

            //#endregion

            resolve();
        })
    }

    /**
     * @private
     * @param {Grid} grid 
     * @param {TileModel} model 
     * @param {(value: (Tile|null), x: number, y: number) => boolean} conditionFn This is a predicate, thanks zoe <3
     */
    fillGridWithTile(grid, model, conditionFn = null) {
        
        // To avoid checking the types every time
        let hasCondition = typeof conditionFn == "function";
        let isModel = model instanceof TileModel;

        grid.eachItem((tile, x, y) => {
            if(hasCondition && conditionFn(tile, x, y)) {
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
