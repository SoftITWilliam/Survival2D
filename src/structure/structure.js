import { TILE_SIZE } from '../game/global.js';

export default class Structure {
    constructor(gridX,gridY,world) {
        this.world = world; // Pointer
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * TILE_SIZE;
        this.y = -gridY * TILE_SIZE;
    }

    generate() {

    }
}