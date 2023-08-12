import { ctx } from "../game/global.js";

const PROGRESS_DISPLAY_RADIUS = 16;

export default class MiningAction {
    constructor(tile, item, game) {
        this.world = game.world;
        this.tile = tile;
        this.finished = false;

        if(item) {
            this.toolType = item.toolType ? item.toolType : null;
            this.miningSpeed = item.miningSpeed ? item.miningSpeed : 1;
            this.miningLevel = item.miningLevel ? item.miningLevel : 0;
        } else {
            this.toolType = null;
            this.miningSpeed = 1;
            this.miningLevel = 0;
        }
        
        this.timer = 0;

        // Calculate total mining time
        this.totalTime = this.tile.getMiningTime() * 1000;

        if(tile.getToolType() == this.toolType) {
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

        let object = this.tile.getType() == "wall" ?
            this.world.getWall(gx, gy) : this.world.getTile(gx, gy);

        // Break tile
        object.breakTile(this.tile, this.toolType, this.miningLevel);

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