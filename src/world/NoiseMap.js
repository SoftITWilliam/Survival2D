import { rng } from "../misc/util.js";

export default class NoiseMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid; 
    }

    get(x, y) {
        try {
            return this.grid[x][y];
        } catch {
            return false;
        }
    }

    generate(min, max) {
        let noiseGrid = [];
        for(let x = 0; x < this.width; x++) {
            let row = [];
            for(let y = 0; y < this.height; y++) {
                let noise = rng(min, max);
                row.push(noise);
            }
            noiseGrid.push(row);
        }
        this.grid = noiseGrid;
        return noiseGrid;
    }

    applyBlur(range) {
        let blurredNoiseGrid = [];
        for(let x = 0; x < this.width; x++) {
            let row = [];
            for(let y = 0; y < this.height; y++) {
                row.push(this.getBlurredNoise(x, y, range));
            }
            blurredNoiseGrid.push(row);
        }
        this.grid = blurredNoiseGrid;
    }

    getBlurredNoise(gridX, gridY, range) {
        let source = [];

        // Get all values in a grid around the coordinate
        for(let x = gridX - range; x <= gridX + range; x++) {
            for(let y = gridY - range; y <= gridY + range; y++) {
                if(x < 0 || x >= this.width || y < 0 || y >= this.height) return;
                source.push(this.get(x, y));
            }
        }

        // Get the average of the source values
        let l = source.length;
        let sum = 0;
        for(let i = 0; i < l; i++) {
            sum += source[i];
        }

        return sum / l;
    }
}