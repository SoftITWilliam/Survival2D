
// FIXED IMPORTS:
import * as tiles from '../tile/tileParent.js';
import * as structures from '../structure/structureParent.js';
import { rng } from '../misc/util.js';
import { BASE_TERRAIN_HEIGHT, WORLD_HEIGHT, WORLD_WIDTH } from '../game/global.js';
import { createLightingGrid } from './lighting.js';
import { outOfBounds } from '../misc/util.js';
import { blurNoiseGrid, generateNoiseGrid } from './noise.js';
import { generateDirtDepth, generateTerrainHeight, generateTerrainTile, generateTerrainWall } from './generation.js';

export const HEIGHTMAP = generateTerrainHeight();

export class World {
    constructor(game,height,width) {
        this.game = game; // Pointer to Game object
        this.height = height; // World height in tiles
        this.width = width; // World width in tiles

        this.tileGrid = [];
        this.wallGrid = [];

        for(let x=0;x<this.width;x++) {
            this.tileGrid.push([]);
            this.wallGrid.push([]);
        }
    }

    // Return the tile at the given position
    getTile(x,y) {
        return outOfBounds(x,y) ? null : this.tileGrid[x][y];
    }

    // Return the wall at the given position
    getWall(x,y) {
        return outOfBounds(x,y) ? null : this.wallGrid[x][y];
    }

    // Clear the given tile
    clearTile(x,y) {
        this.tileGrid[x][y] = null;
    }

    // Clear the given wall
    clearWall(x,y) {
        this.wallGrid[x][y] = null;
    }

    // Set the tile at the given position to the given tile
    setTile(x,y,tile) {
        this.tileGrid[x][y] = tile;
    }

    generate() {
        let noiseGrid = generateNoiseGrid(this.width,this.height);
        let dirtDepth = generateDirtDepth();
        noiseGrid = blurNoiseGrid();

        // Place tiles based on noise
        for(let x=0;x<WORLD_WIDTH;x++) {
            for(let y=0;y<WORLD_HEIGHT;y++) {
                let threshold = 55;
                

                this.tileGrid[x].push(generateTerrainTile(x,y,threshold,dirtDepth,noiseGrid[x][y],this));
                this.wallGrid[x].push(generateTerrainWall(x,y,dirtDepth,this));
            }
        }

        //createLightingGrid();
        this.updateAllTiles();
    }    

    updateAllTiles() {
        for(let x=0;x<this.width;x++) {
            for(let y=0;y<this.height;y++) {
                let tile = this.tileGrid[x][y];
                if(!tile) {
                    continue;
                }
                tile.getTilesetSource();
            }
        }
    }
}

export let levelStructures = [];

export function loadWorld() {
    //generateWorld();
    //loadStructures();
}

// Convert all generated 'structures' into actual tiles
export function loadStructures() {
    for(let i=0;i<levelStructures.length;i++) {
        levelStructures[i].generate();
    }
}

// Adds a block for a structure.
// If "Override" is enabled, the structure will replace existing blocks.
// If "Override" is disabled, the structure will not replace existing blocks.
export function structureBlock(block,x,y,overwrite) {

    if(x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) {
        return;
    }

    

    switch(block) {
        case "Log":
            wallGrid[x][y] = new tiles.Log(x,y);
            break;
        case "Leaves":
            if(!overwrite && tileGrid[x][y]) {return;}
            tileGrid[x][y] = new tiles.Leaves(x,y);
            break;
    }
}



export function updateNearbyTiles(gx,gy) {
    
    for(let x=gx-1;x<=gx+1;x++) {
        for(let y=gy-1;y<=gy+1;y++) {
            if(x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) {
                continue;
            }

            let tile = tileGrid[x][y];
            if(!tile) {
                continue;
            }
            
            tile.getTilesetSource();
            tile.update();
        }
    }
}

