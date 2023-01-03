import * as tiles from '../tile/tileParent.js';
import * as structures from '../structure/structureParent.js';
import { BASE_TERRAIN_HEIGHT, WORLD_WIDTH } from "../game/global.js";
import { rng } from "../misc/util.js";
import { HEIGHTMAP } from "./world.js";



export function generateTerrainTile(x,y,threshold,dirtDepth,noiseValue,world) {
    // No blocks or walls are generated above surface height
    if(y > HEIGHTMAP[x] || noiseValue >= threshold) {
        return null;
    }

    // Grass
    if(HEIGHTMAP[x] == y) {
        // Try to generate a tree
        generateTree(x,y+1,world);
        return new tiles.Grass(x,y,world);
    } 
    
    // Dirt
    else if(HEIGHTMAP[x] - dirtDepth < y) {
        return new tiles.Dirt(x,y,world);
    } 
    
    // Stone
    else {
        return new tiles.Stone(x,y,world);
    }
}

export function generateTerrainWall(x,y,dirtDepth,world) {
    // No wall
    if(y > HEIGHTMAP[x]) {
        return null;
    }

    // Dirt walls
    if(HEIGHTMAP[x] - dirtDepth <= y) {
        return new tiles.DirtWall(x,y,world);
    } 
    
    // Stone walls
    else {
        return new tiles.StoneWall(x,y,world);
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

export function generateDirtDepth(world) {
    let dirtDepth = [];
    for(let i=0;i<world.width;i++) {
        dirtDepth.push(rng(3,5));
    }
    return dirtDepth;
}

// Has a chance of placing a Tree structure.
export function generateTree(x,y,world) {
    let n = rng(0,20);
    if(n == 20) {
        world.structures.push(new structures.BasicTree(x,y,world));
    }
}