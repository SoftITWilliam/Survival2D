

import { WorldGeneration } from './WorldGeneration.js';
import { Tile } from '../tile/Tile.js';
import { TILE_SIZE } from '../game/global.js';
import { TileModel } from '../tile/tileModel.js';
import { Grid } from '../class/Grid.js';
import { WorldLighting } from './WorldLighting.js';
import { validNumbers } from '../helper/helper.js';
import Structure from '../structure/structure.js';
import { Game } from '../game/game.js';
import ItemEntityManager from '../item/itemEntityManager.js';
import MiningAction from '../player/mining.js';
import { Observable } from '../class/Observable.js';

export class World {
    /** @type {Grid} */
    #tilemap;
    /** @type {Grid} */
    #wallmap;

    #worldGen = new WorldGeneration(this);

    tileUpdateObservable = new Observable();

    /** @type {Structure[]} */
    structures = [];

    frameCounter = 0;
    ticksPerSecond = 10;

    itemEntities = new ItemEntityManager();

    /**
     * @param {Game} game 
     * @param {number} width World width in tiles
     * @param {number} height World height in tiles
     */
    constructor(game, width, height) {

        /** @type {Game} */
        this.game = game; // todo: get rid of the need to store a reference to game

        /** @type {WorldLighting} */
        this.lighting = new WorldLighting(this);

        this.#tilemap = new Grid(width, height);
        this.#wallmap = new Grid(width, height);

        MiningAction.tileMinedSubject.subscribe(({ tile, item }) => {
            tile.break(item);
            this.tileUpdateObservable.notify({ x: tile.gridX, y: tile.gridY });
        });

        this.tileUpdateObservable.subscribe(({ x, y }) => {
            this.updateNearbyTiles(x, y); 
        });
    }

    /**
     * Run world generation algorithm. Manipulates tilemaps of this World object.
     */
    async generate() {
        await this.#worldGen.generate();

        // Convert all generated 'structures' into actual tiles
        this.structures.forEach(structure => {
            structure.generate();
        })

        this.updateAllTiles();

        return true;
    }    

    //#region | Property getters

    /** @readonly */
    get heightmap() { return this.#worldGen.heightmap }

    /** @readonly */
    get width() { return this.#tilemap.width; }

    /** @readonly */
    get height() { return this.#tilemap.width; }

    /** @readonly */
    get tiles() { return this.#tilemap }

    /** @readonly */
    get walls() { return this.#wallmap }

    //#endregion
    
    //#region | Tilemap manipulation methods

    /**
     * Create a new tile object of the provided type, at the provided position
     * @overload
     * @param {number} x X position in grid
     * @param {number} y Y position in grid
     * @param {TileModel} tileModel 
     * 
     * Set the tile object at the provided position
     * @overload
     * @param {number} x X position in grid
     * @param {number} y Y position in grid
     * @param {Tile} tile 
     */
    setTile(x, y, arg) {

        var set = (tile) => this.tiles.set(x, y, tile);

        if(arg instanceof TileModel)
            set(new Tile(this, x, y, arg));
        
        else if(arg instanceof Tile)
            set(arg);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {(TileModel|Tile)} tile 
     */
    setTileIfEmpty(x, y, tile) {
        if(this.tiles.isEmptyAt(x, y)) {
            this.setTile(x, y, tile)
        }
    }

    /**
     * Create a new wall object of the provided type, at the provided position
     * @overload
     * @param {number} x X position in grid
     * @param {number} y Y position in grid
     * @param {TileModel} wallModel 
     * 
     * Set the wall object at the provided position
     * @overload
     * @param {number} x X position in grid
     * @param {number} y Y position in grid
     * @param {Tile} wall 
     */
    setWall(x, y, arg) {

        var set = (wall) => this.walls.set(x, y, wall);

        if(arg instanceof TileModel)
            set(new Tile(this, x, y, arg));
        
        else if(arg instanceof Tile)
            set(arg);
    }
    
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {(TileModel|Tile)} wall 
     */
    setWallIfEmpty(x, y, wall) {
        if(this.tiles.isEmptyAt(x, y)) {
            this.setTile(x, y, wall)
        }
    }

    //#endregion

    //#region | Tick methods

    // TODO use deltatime
    tickCounter() {
        this.frameCounter += 1;
        if(this.frameCounter > 60 / this.ticksPerSecond) {
            this.frameCounter = 0;
            this.tick();
        }
    }

    /**
     * Run .tickUpdate() method for all tiles in world
     */
    tick() {
        // If performance becomes an issue, this should be optimized using world chunks
        for(const tile of this.tiles) {
            tile?.tickUpdate();
        }
    }

    //#endregion

    //#region | Tilemap update methods

    /**
     * Run .updateTile() method for all tiles and walls in world
     */
    updateAllTiles() {
        for(const tile of this.tiles) {
            this.updateTile(tile);
        }
        for(const wall of this.walls) {
            this.updateTile(wall);
        }
    }

    // Deprecated, replace later
    updateNearbyTiles(gridX, gridY) {
        this.updateTilesInRange(gridX, gridY, 1);
    }

    /**
     * Update tile at provided position, and all tiles in a certain range
     * @param {number} gridX 
     * @param {number} gridY 
     * @param {number} tileRange 
     */
    updateTilesInRange(gridX, gridY, tileRange) {
        const size = tileRange * 2 + 1, gx = gridX - tileRange, gy = gridY - tileRange;
        this.tiles.asArray(gx, gy, size, size).forEach(tile => this.updateTile(tile));
        this.walls.asArray(gx, gy, size, size).forEach(wall => this.updateTile(wall));
    }

    /**
     * @param {Tile} tile 
     */
    updateTile(tile) {
        if(tile) {
            tile.updateSpritePosition();
            tile.tileUpdate();
        }
    }

    /**
     * @param {Tile} tile 
     */
    handlePlacedTile(tile) {
        this.tileUpdateObservable.notify({ x: tile.gridX, y: tile.gridY });
    }
    
    //#endregion

    //#region | Utils

    /**
     * @param {number} gridX 
     * @param {number} gridY 
     * @param {number} range 
     * @returns {Tile[]}
     */
    getTilesInRange(gridX, gridY, range) {
        if(!validNumbers(gridX, gridY, range))
            throw new RangeError("Dumbass");

        let size = range * 2 + 1;

        return this.tiles.asArray(gridX - range, gridY - range, size, size, true);
    }

    /**
     * If the provided coordinates are invalid or outside of the map (ex. an X coordinate of -1), return true
     * @param {(number | any)} x X position in grid
     * @param {(number | any)} y Y position in grid
     * @returns 
     */
    outOfBounds(x, y) {
        return (!validNumbers(x, y) || 
            x < 0 || x >= this.width || 
            y < 0 || y >= this.height);
    }

    //#endregion

    //#region | Static methods

    /**
     * Converts Y coordinate to grid position
     * @param {number} x canvas X coordinate
     * @returns {number} X position in grid
     */
    static gridXfromCoordinate(x) {
        return Math.floor(x / TILE_SIZE);
    }

    /**
     * Converts Y coordinate to grid position
     * @param {number} y canvas Y coordinate
     * @returns {number} Y position in grid
     */
    static gridYfromCoordinate(y) {
        return -Math.floor(y / TILE_SIZE);
    }

    //#endregion
}