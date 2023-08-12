import { clamp } from "../misc/util.js";
import { canvas, TILE_SIZE } from "../game/global.js";

export default class PlayerCamera {
    constructor(player) {
        this.player = player;
        this._x;
        this._y;
    }

    /**
     * Set the camera position to center the player
     */
    update() {
        this._x = Math.round(this.player.centerX - (canvas.width / 2));
        this._y = Math.round(this.player.centerY - (canvas.height / 2));
    }

    get x() {
        return clamp(this._x, 0, this.player.game.world.width * TILE_SIZE - canvas.width);
    }
    
    get y() {
        return clamp(this._y, -this.player.game.world.height * TILE_SIZE, -canvas.height + TILE_SIZE);
    }

    /**
     * Return the camera X value, limited by the world boundaries
     * @returns {Number}
     */
    getX() { return this.x }

    /**
     * Return the camera Y value, limited by the world boundaries
     * @returns {Number}
     */
    getY() { return this.y }
}