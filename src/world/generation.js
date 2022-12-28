import * as tiles from '../tile/tileParent.js';
import { BASE_TERRAIN_HEIGHT, WORLD_WIDTH } from "../game/global.js";
import { rng } from "../misc/util.js";
import { HEIGHTMAP, levelStructures } from "./world.js";



export function generateTerrainTile(x,y,threshold,dirtDepth,noiseValue,pointer) {
    // No blocks or walls are generated above surface height
    if(y > HEIGHTMAP[x] || noiseValue >= threshold) {
        return null;
    }

    // Grass
    if(HEIGHTMAP[x] == y) {
        // Try to generate a tree
        generateTree(x,y+1);
        return new tiles.Grass(pointer,x,y);
    } 
    
    // Dirt
    else if(HEIGHTMAP[x] - dirtDepth[x] < y) {
        return new tiles.Dirt(pointer,x,y);
    } 
    
    // Stone
    else {
        return new tiles.Stone(pointer,x,y);
    }
}

export function generateTerrainWall(x,y,dirtDepth,pointer) {
    // No wall
    if(y > HEIGHTMAP[x]) {
        return null;
    }

    // Dirt walls
    if(HEIGHTMAP[x] - dirtDepth[x] <= y) {
        return new tiles.DirtWall(pointer,x,y);
    } 
    
    // Stone walls
    else {
        return new tiles.StoneWall(pointer,x,y);
    }
}



export function generateTerrainHeight() {
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

export function generateDirtDepth() {
    let dirtDepth = [];
    for(let i=0;i<WORLD_WIDTH;i++) {
        dirtDepth.push(rng(3,5));
    }
    return dirtDepth;
}

// Has a chance of placing a Tree structure.
export function generateTree(x,y) {
    let n = rng(0,20);
    if(n == 20) {
        //levelStructures.push(new structures.BasicTree(x,y));
    }
}