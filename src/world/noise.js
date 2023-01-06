import { WORLD_HEIGHT, WORLD_WIDTH } from "../game/global.js";
import { rng } from "../misc/util.js";

export default class Noise {
    constructor(min,max,world) {
        this.world = world; // Pointer
        this.width = world.width;
        this.height = world.height;
        this.minValue = min;
        this.maxValue = max;
        this.grid = this.generate();
    }

    get(x,y) {
        try {
            return this.grid[x][y];
        } catch {
            return false;
        }
    }

    generate() {
        let noiseGrid = [];
        for(let x = 0;x<this.width;x++) {
            let row = [];
            for(let y = 0;y<this.height;y++) {
                let noise = rng(this.minValue,this.maxValue);
                row.push(noise);
            }
            noiseGrid.push(row);
        }
        return noiseGrid;
    }

    blur(range) {
        let blurredNoiseGrid = [];
        for(let x = 0;x<this.width;x++) {
            let row = [];
            for(let y=0;y<this.height;y++) {
                row.push(this.getBlurredNoise(x,y,range));
            }
            blurredNoiseGrid.push(row);
        }
        this.grid = blurredNoiseGrid;
    }

    getBlurredNoise(gridX,gridY,range) {
        let source = [];

        // Get all values in a grid around the coordinate
        for(let x = -range ; x <= range ; x++) {
            for(let y = -range ; y<= range ; y++) {
                if(!this.world.outOfBounds(gridX+x,gridY+y)) {
                    source.push(this.get(gridX+x,gridY+y));
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
}