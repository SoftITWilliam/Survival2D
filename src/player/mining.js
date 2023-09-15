import { ctx } from "../game/global.js";
import { Tile } from "../tile/Tile.js";

const PROGRESS_DISPLAY_RADIUS = 16;

export default class MiningAction {
    constructor(tile, item, game) {
        this.world = game.world;
        this.tile = tile;
        this.finished = false;

        this.item = item ?? null;
        this.toolType = item?.toolType ?? null;
        this.miningSpeed = item?.miningSpeed ?? 1;
        this.miningLevel = item?.miningLevel ?? 0;

        this.timer = 0;

        // Calculate total mining time
        this.totalTime = this.tile.miningTime * 1000;

        if(this.toolType === tile.toolType) {
            this.totalTime = Math.floor(this.totalTime / this.miningSpeed);
        }
    }

    increaseProgress(dt) {
        this.timer += dt;
        if(this.timer >= this.totalTime) {
            this.finish();
        }
    }

    finish() {
        let gx = this.tile.gridX;
        let gy = this.tile.gridY;

        let object = this.tile.type == Tile.types.WALL ?
            this.world.walls.get(gx, gy) : this.world.tiles.get(gx, gy);

        // Break tile
        object.breakTile(this.tile, this.item, this.world);

        this.finished = true;
    }

    drawProgress() {
        let p = 1.5 + this.timer / this.totalTime * 2;
        let cx = this.tile.centerX;
        let cy = this.tile.centerY;

        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - PROGRESS_DISPLAY_RADIUS);
        ctx.arc(cx, cy, PROGRESS_DISPLAY_RADIUS, 1.5 * Math.PI, p * Math.PI);
        ctx.lineTo(cx, cy);
        ctx.fill();
    }
}