
import LightingGrid from './LightingGrid.js';
import { generateTerrainHeight, WorldGeneration } from './WorldGeneration.js';
import { Tile } from '../tile/Tile.js';
import { TILE_SIZE } from '../game/global.js';
import { TileRegistry } from '../tile/tileRegistry.js';
import { TileModel } from '../tile/tileModel.js';

export const HEIGHTMAP = generateTerrainHeight();

export class World {
    constructor(game, width, height) {
        this.game = game; // Pointer to Game object
        this.width = width; // World width in tiles
        this.height = height; // World height in tiles

        this.tileGrid = [];
        this.wallGrid = [];

        this.lighting = new LightingGrid(this);

        this.worldGen = new WorldGeneration(this);

        for(let x = 0; x < this.width; x++) {
            this.tileGrid.push([]);
            this.wallGrid.push([]);
        }

        this.structures = [];

        this.frameCounter = 0;
        this.ticksPerSecond = 10;
    }

    // Return the tile at the given position
    getTile(x, y) {
        try {
            return this.outOfBounds(x, y) ? null : this.tileGrid[x][y];
        } catch {
            return null;
        }
    }

    // Return the wall at the given position
    getWall(x, y) {
        try {
            return this.outOfBounds(x, y) ? null : this.wallGrid[x][y];
        } catch {
            return null;
        }
    }

    // Clear the given tile
    clearTile(x, y) {
        if(!this.outOfBounds(x, y)) {
            this.tileGrid[x][y] = null;
        }
    }

    // Clear the given wall
    clearWall(x, y) {
        if(!this.outOfBounds(x, y)) {
            this.wallGrid[x][y] = null;
        }
    }
    
    getTilesInRange(gridX, gridY, range) {
        let tileArray = [];
        for(let x = gridX - range; x <= gridX + range; x++) {
            for(let y = gridY - range; y <= gridY + range; y++) {
                let tile = this.getTile(x, y);
                if(tile) tileArray.push(tile);
            }
        }
        return tileArray;
    }

    setTileIfEmpty(x, y, tileModel) {
        if(this.outOfBounds(x, y) || this.getTile(x, y)) return;

        if(!tileModel instanceof TileModel) return;

        const tile = new Tile(this, x, y, tileModel);
        this.tileGrid[x][y] = tile;
    }

    setTile(x, y, tileModel) {
        if(this.outOfBounds(x, y)) return;

        if(!tileModel instanceof TileModel) return;
        
        const tile = new Tile(this, x, y, tileModel);
        this.tileGrid[x][y] = tile;
    }

    // Set the wall at the given position to the given wall
    setWall(x, y, wallModel) {
        if(this.outOfBounds(x, y)) return;

        if(!wallModel instanceof TileModel) return;

        const wall = new Tile(this, x, y, wallModel);
        this.wallGrid[x][y] = wall;
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
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this.getTile(x, y)?.tickUpdate();
            }
        }
    }

    generate() {
        this.worldGen.generate();

        // Convert all generated 'structures' into actual tiles
        this.structures.forEach(structure => {
            structure.generate();
        })

        this.lighting.generate();

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
        if(this.outOfBounds(gridX, gridY)) return;

        try {
            let tile = this.getTile(gridX, gridY);
            tile?.getSpritePosition();
            tile?.tileUpdate();

            let wall = this.getWall(gridX, gridY);
            wall?.getSpritePosition();
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