

import { WorldGeneration } from './WorldGeneration.js';
import { Tile } from '../tile/Tile.js';
import { TILE_SIZE } from '../game/global.js';
import { TileModel } from '../tile/tileModel.js';
import { Grid } from '../class/Grid.js';
import { WorldLighting } from './WorldLighting.js';

export class World {
    constructor(game, width, height) {
        this.game = game; // Pointer to Game object
        this.width = width; // World width in tiles
        this.height = height; // World height in tiles

        this.tiles = new Grid(width, height);
        this.walls = new Grid(width, height);

        this.lighting = new WorldLighting(this);

        this.worldGen = new WorldGeneration(this);

        this.structures = [];

        this.frameCounter = 0;
        this.ticksPerSecond = 10;
    }

    get heightmap() {
        return this.worldGen.heightmap;
    }

    // Clear the given tile
    clearTile(x, y) {
        this.tiles.clear(x, y);
    }

    // Clear the given wall
    clearWall(x, y) {
        this.walls.clear(x, y);
    }
    
    getTilesInRange(gridX, gridY, range) {
        let tileArray = [];
        for(let x = gridX - range; x <= gridX + range; x++) {
            for(let y = gridY - range; y <= gridY + range; y++) {
                let tile = this.tiles.get(x, y);
                if(tile) tileArray.push(tile);
            }
        }
        return tileArray;
    }

    setTileIfEmpty(x, y, tileModel) {
        if(tileModel instanceof TileModel) {
            const tile = new Tile(this, x, y, tileModel);
            this.tiles.set(x, y, tile);
        }
    }

    setTile(x, y, tileModel) {
        if(tileModel instanceof TileModel) {
            const tile = new Tile(this, x, y, tileModel);
            this.tiles.set(x, y, tile);
        }
    }

    // Set the wall at the given position to the given wall
    setWall(x, y, wallModel) {
        if(wallModel instanceof TileModel) {
            const wall = new Tile(this, x, y, wallModel);
            this.walls.set(x, y, wall);
        }
    }

    // If the given coordinates are outside of the map (ex. an X coordinate of -1), return true
    outOfBounds(x, y) {
        if(isNaN(x) || isNaN(y)) {
            return true;
        }
            
        return (x < 0 || x >= this.width || y < 0 || y >= this.height);
    }

    tickCounter() {
        this.frameCounter += 1;
        if(this.frameCounter > 60 / this.ticksPerSecond) {
            this.frameCounter = 0;
            this.tick();
        }
    }

    tick() {
        // If performance becomes an issue, this should be optimized using world chunks
        this.tiles.asArray().forEach(tile => tile?.tickUpdate());
    }

    generate() {
        this.worldGen.generate();

        // Convert all generated 'structures' into actual tiles
        this.structures.forEach(structure => {
            structure.generate();
        })

        this.lighting.initialize();

        this.updateAllTiles();
    }    

    updateAllTiles() {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this.updateTile(x, y);
            }
        }
    }

    updateNearbyTiles(gridX, gridY) {
        for(let x = gridX - 1; x <= gridX + 1; x++) {
            for(let y = gridY - 1; y <= gridY + 1; y++) {
                this.updateTile(x, y);
            }
        }
    }

    updateTile(gridX, gridY) {
        try {
            let tile = this.tiles.get(gridX, gridY);
            tile?.updateSpritePosition();
            tile?.tileUpdate();

            let wall = this.walls.get(gridX, gridY);
            wall?.updateSpritePosition();
            wall?.tileUpdate();
        }
        catch(error) {
            console.warn("Tile update failed!");
            console.warn(error);
        }
    }

    /**
     * Takes an X coordinate and return its grid equivalent
     * @param {int} x canvas X coordinate
     * @returns {*} grid X coordinate (false if outside grid)
     */
    static gridXfromCoordinate(x) {
        return Math.floor(x / TILE_SIZE);
    }

    /**
     * Takes an Y coordinate and return its grid equivalent
     * @param {int} x canvas X coordinate
     * @returns {int} grid X coordinate (false if outside grid)
     */
    static gridYfromCoordinate(y) {
        return -Math.floor(y / TILE_SIZE);
    }
}