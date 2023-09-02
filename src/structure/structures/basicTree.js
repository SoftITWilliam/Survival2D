import { rng, roll } from '../../helper/helper.js';
import Structure from '../structure.js';

const LOG_HEIGHT_MIN = 4;
const LOG_HEIGHT_MAX = 10;

const BASE_HEIGHT_MIN = 3;
const BASE_HEIGHT_MAX = 5;

export class BasicTree extends Structure {
    constructor(gridX, gridY, world) {
        super(gridX, gridY, world);
        this.ID = 0;
    }

    generate() {
        // Generate logs
        let logHeight = rng(LOG_HEIGHT_MIN, LOG_HEIGHT_MAX);
        
        for(let i = 0; i < logHeight; i++) {
            this.world.setWall(this.gridX, this.gridY + i, "log");
        }

        // Generate some values for the leaves
        let baseHeight = rng(BASE_HEIGHT_MIN, BASE_HEIGHT_MAX);

        let leftAppendCount = rng(0, baseHeight - 1);
        let rightAppendCount = rng(0, baseHeight - 1);
        let topAppendCount = rng(0, 3);

        let yTop = this.gridY + logHeight;
        let leavesTop = yTop;

        if(baseHeight >= 3) {
            leavesTop += 1;
        }

        for(let y = 0; y < baseHeight; y++) {
            for(let x = -1; x <= 1; x++) {
                this.world.setTileIfEmpty(this.gridX + x, leavesTop - y, "leaves");
            }
        }

        // Bottom append:
        // 3 blocks below the leaf "base". Each has a 50% chance of appearing.
        for(let i = -1; i <= 1; i++) {
            if(roll(2)) {
                this.world.setTileIfEmpty(this.gridX + i, leavesTop - baseHeight, "leaves");
            }
        }

        // Top append
        // Randomize lean direction if 2 aw
        let lean = 0;
        if(topAppendCount == 1) {
            lean = 1;
        } else if(topAppendCount == 2) {
            lean = rng(0, 1);
        }

        for(let i = 1; i < topAppendCount; i++) {
            this.world.setTileIfEmpty(this.gridX + i + lean - 1, leavesTop - 1, "leaves");
        }

        let aY = rng(1, baseHeight - leftAppendCount);
        for(let i = 0; i < leftAppendCount; i++) {
            this.world.setTileIfEmpty(this.gridX - 2, leavesTop - aY - i, "leaves");
        }

        aY = rng(1, baseHeight - rightAppendCount);
        if(rightAppendCount == 1 && aY == 0) aY == 1; 
        for(let i = 0; i < rightAppendCount; i++) {
            this.world.setTileIfEmpty(this.gridX + 2, leavesTop - aY - i, "leaves");
        }

    }
}