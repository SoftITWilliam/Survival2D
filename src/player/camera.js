import { clamp } from "../misc/util.js";
import { canvas, TILE_SIZE } from "../game/global.js";

export default class PlayerCamera {
    #x;
    #y;

    constructor(player) {
        this.player = player;
        this.#x;
        this.#y;
    }

    /**
     * Set the camera position to center the player
     */
    update() {
        this.#x = Math.round(this.player.getX() + (this.player.getWidth() / 2) - (canvas.width / 2));
        this.#y = Math.round(this.player.getY() + (this.player.getHeight() / 2) - (canvas.height / 2));
    }

    /**
     * Return the camera X value, limited by the world boundaries
     * @returns {Number}
     */
    getX() {
        return clamp(this.#x,0,this.player.game.world.width * TILE_SIZE - canvas.width);
    }

    /**
     * Return the camera Y value, limited by the world boundaries
     * @returns {Number}
     */
    getY() {
        let y = clamp(this.#y,-this.player.game.world.height * TILE_SIZE,-canvas.height + TILE_SIZE);
        return y;
    }
}