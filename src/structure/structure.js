import { TILE_SIZE } from '../game/const.js';

export default class Structure {
    constructor(gridX,gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * TILE_SIZE;
        this.y = -gridY * TILE_SIZE;
    }

    generate() {

    }
}