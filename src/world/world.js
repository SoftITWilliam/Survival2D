
// FIXED IMPORTS:
import * as tiles from '../tile/tileParent.js';
import * as structures from '../structure/structureParent.js';
import { rng } from '../misc/util.js';
import { BASE_TERRAIN_HEIGHT, WORLD_HEIGHT, WORLD_WIDTH } from '../game/const.js';
import { createLightingGrid } from './lighting.js';


const HEIGHTMAP = generateTerrainHeight();


let levelStructures = [

];

export let tileGrid = [];
export let wallGrid = [];

function loadWorld() {
    generateWorld();
    loadStructures();
}

// Convert all generated 'structures' into actual tiles
function loadStructures() {
    for(let i=0;i<levelStructures.length;i++) {
        levelStructures[i].generate();
    }
}

function generateWorld() {
    let noiseGrid = generateNoiseGrid();
    noiseGrid = blurNoiseGrid(noiseGrid,2);

    for(let x=0;x<WORLD_WIDTH;x++) {
        tileGrid.push([]);
        wallGrid.push([]);
    }

    // Generate terrain
    for(let x=0;x<WORLD_WIDTH;x++) {
        for(let y=0;y<WORLD_HEIGHT;y++) {
            let threshold = 55;
            let dirtDepth = generateDirtDepth();

            generateTerrainTile(x,y,threshold,dirtDepth,noiseGrid[x][y]);
            generateTerrainWall(x,y,dirtDepth);
        }
    }

    createLightingGrid();
}

function generateTerrainTile(x,y,threshold,dirtDepth,noiseValue) {
    // No blocks or walls are generated above surface height
    if(y > HEIGHTMAP[x] || noiseValue >= threshold) {
        tileGrid[x].push(null);
        return;
    }

    // Grass
    if(HEIGHTMAP[x] == y) {
        tileGrid[x].push(new tiles.Grass(x,y));
        // Try to generate a tree
        generateTree(x,y+1);
    } 
    
    // Dirt
    else if(HEIGHTMAP[x] - dirtDepth[x] < y) {
        tileGrid[x].push(new tiles.Dirt(x,y));
    } 
    
    // Stone
    else {
        tileGrid[x].push(new tiles.Stone(x,y));
    }
}

function generateTerrainWall(x,y,dirtDepth) {
    // No wall
    if(y > HEIGHTMAP[x]) {
        wallGrid[x].push(null);
        return;
    }

    // Dirt walls
    if(HEIGHTMAP[x] - dirtDepth[x] <= y) {
        wallGrid[x].push(new tiles.DirtWall(x,y));
    } 
    
    // Stone walls
    else {
        wallGrid[x].push(new tiles.StoneWall(x,y));
    }
}

function generateNoiseGrid() {
    let noiseGrid = []
    for(let x = 0;x<WORLD_WIDTH;x++) {
        let row = [];
        for(let y = 0;y<WORLD_HEIGHT;y++) {
            row.push(rng(0,100));
        }
        noiseGrid.push(row);
    }

    return noiseGrid;
}

function blurNoiseGrid(noiseGrid,blurDist) {
    let blurredNoiseGrid = [];
    for(let x = 0;x<WORLD_WIDTH;x++) {
        let row = [];
        for(let y=0;y<WORLD_HEIGHT;y++) {
            row.push(getBlurredNoise(noiseGrid,x,y,blurDist));
        }
        blurredNoiseGrid.push(row);
    }
    return blurredNoiseGrid;
}

function getBlurredNoise(noise,gridX,gridY,blurDist) {
    let source = [];

    // Get all values in a grid around the coordinate
    for(let x = -blurDist ; x <= blurDist ; x++) {
        for(let y = -blurDist ; y<= blurDist ; y++) {
            if(gridX+x >= 0 && gridY+y >= 0 && gridX+x < WORLD_WIDTH && gridY+y < WORLD_HEIGHT) {
                source.push(noise[gridX+x][gridY+y]);
            }
        }
    }

    // Get the average of the source values
    let l = source.length;
    let sum = 0;
    for(let i=0;i<l;i++) {
        sum += source[i];
    }

    return sum / l;
}

function generateTerrainHeight() {
    let heightMap = [];
    heightMap.push(BASE_TERRAIN_HEIGHT + 6);

    for(let x=0 ; x<WORLD_WIDTH ; x++) {
        let pHeight = heightMap[x];

        let rand = rng(1,100);

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

        heightMap[x+1] = pHeight + c;
    }

    return heightMap;
}

function generateDirtDepth() {
    let dirtDepth = [];
    for(let i=0;i<WORLD_WIDTH;i++) {
        dirtDepth.push(rng(3,5));
    }
    return dirtDepth;
}

// Has a chance of placing a Tree structure.
function generateTree(x,y) {
    let n = rng(0,20);
    if(n == 20) {
        levelStructures.push(new structures.BasicTree(x,y));
    }
}

// Adds a block for a structure.
// If "Override" is enabled, the structure will replace existing blocks.
// If "Override" is disabled, the structure will not replace existing blocks.
function structureBlock(block,x,y,overwrite) {

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

function updateTiles() {
    for(let x=0;x<WORLD_WIDTH;x++) {
        for(let y=0;y<WORLD_WIDTH;y++) {
            let tile = tileGrid[x][y];
            if(!tile) {
                continue;
            }
            tile.getTilesetSource();
        }
    }
}

function updateNearbyTiles(gx,gy) {
    
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

export {levelStructures, loadWorld, loadStructures, structureBlock, updateTiles, updateNearbyTiles, HEIGHTMAP }