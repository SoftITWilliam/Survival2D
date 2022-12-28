import { WORLD_HEIGHT, WORLD_WIDTH } from "../game/global.js";
import { rng } from "../misc/util.js";

export function generateNoiseGrid(width,height) {
    let noiseGrid = []
    for(let x = 0;x<width;x++) {
        let row = [];
        for(let y = 0;y<height;y++) {
            row.push(rng(0,100));
        }
        noiseGrid.push(row);
    }

    return noiseGrid;
}

export function blurNoiseGrid(noiseGrid,blurDist) {
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