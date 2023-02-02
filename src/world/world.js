
import * as tiles from '../tile/tileParent.js';
import LightingGrid from './lighting.js';
import { generateTerrainHeight, WorldGeneration } from './generation.js';

export const HEIGHTMAP = generateTerrainHeight();

export class World {
    constructor(game,height,width) {
        this.game = game; // Pointer to Game object
        this.height = height; // World height in tiles
        this.width = width; // World width in tiles

        this.tileGrid = [];
        this.wallGrid = [];

        this.lighting = new LightingGrid(this);

        this.worldGen = new WorldGeneration(this);

        for(let x=0;x<this.width;x++) {
            this.tileGrid.push([]);
            this.wallGrid.push([]);
        }

        this.structures = [];

        this.frameCounter = 0;
        this.ticksPerSecond = 10;
    }

    // Return the tile at the given position
    getTile(x,y) {
        try {
            return this.outOfBounds(x,y) ? null : this.tileGrid[x][y];
        } catch {
            return null;
        }
    }

    // Return the wall at the given position
    getWall(x,y) {
        try {
            return this.outOfBounds(x,y) ? null : this.wallGrid[x][y];
        } catch {
            return null;
        }
    }

    // Clear the given tile
    clearTile(x,y) {
        if(!this.outOfBounds(x,y)) {
            this.tileGrid[x][y] = null;
        }
    }

    // Clear the given wall
    clearWall(x,y) {
        if(!this.outOfBounds(x,y)) {
            this.wallGrid[x][y] = null;
        }
    }

    // Set the tile at the given position to the given tile
    setTile(x,y,tile) {
        if(!this.outOfBounds(x,y)) {
            this.tileGrid[x][y] = tile;
        }
        
    }

    // Set the wall at the given position to the given wall
    setWall(x,y,wall) {
        if(!this.outOfBounds(x,y)) {
            this.wallGrid[x][y] = wall;
        }
    }

    // If the given coordinates are outside of the map (ex. an X coordinate of -1), return true
    outOfBounds(x,y) {
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
        console.log("Tick!");
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let tile = this.getTile(x,y);
                if(!tile) {
                    continue;
                }
                tile.tickUpdate();
            }
        }
    }

    generate() {
        //let noise = new Noise(0,100,this);
        //noise.blur(3);
        //let dirtDepth = generateDirtDepth(this);

        this.worldGen.generate();

        // Place tiles based on noise
        //for(let x=0;x<this.width;x++) {
        //    for(let y=0;y<this.height;y++) {
        //        let threshold = 53;

        //        this.tileGrid[x].push(generateTerrainTile(x,y,threshold,dirtDepth[x],noise.get(x,y),this));
        //        this.wallGrid[x].push(generateTerrainWall(x,y,dirtDepth[x],this));
        //    }
        //}

        // Convert all generated 'structures' into actual tiles
        this.structures.forEach(structure => {
            structure.generate();
        })

        this.lighting.generate();

        this.updateAllTiles();
    }    

    updateAllTiles() {
        for(let x=0;x<this.width;x++) {
            for(let y=0;y<this.height;y++) {
                let tile = this.getTile(x,y);
                if(!tile) {
                    continue;
                }
                tile.getTilesetSource();
                tile.tileUpdate();
            }
        }
    }

    updateNearbyTiles(gridX,gridY) {
        for(let x=gridX-1;x<=gridX+1;x++) {
            for(let y=gridY-1;y<=gridY+1;y++) {
                if(this.outOfBounds(x,y)) {
                    continue;
                }
    
                let tile = this.getTile(x,y);
                if(!tile) {
                    continue;
                }
                
                tile.getTilesetSource();
                tile.tileUpdate();
            }
        }
    }

    // Adds a block for a structure.
    // If "Override" is enabled, the structure will replace existing blocks.
    // If "Override" is disabled, the structure will not replace existing blocks.

    addStructureTile(tileName,gridX,gridY,override) {
        
        if(this.outOfBounds(gridX,gridY)) {
            return;
        }

        switch(tileName) {
            case "Log":
                this.setWall(gridX,gridY,new tiles.Log(gridX,gridY,this));
                break;
            case "Leaves":
                if(!override && this.getTile(gridX,gridY)) {return}
                this.setTile(gridX,gridY,new tiles.Leaves(gridX,gridY,this));
                break;
        }
    }
}