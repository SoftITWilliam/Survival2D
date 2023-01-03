import { clamp } from "../misc/util.js";
import { TILE_SIZE } from "./global.js";

export class Camera {
    constructor(player) {
        this.player = player;
        this.x;
        this.y;
    }

    limX() {
        return clamp(this.x,0,this.player.game.world.width * TILE_SIZE - canvas.width);
    }
}