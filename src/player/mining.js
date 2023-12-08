import { Observable } from "../class/Observable.js";
import { Tile } from "../tile/Tile.js";
import Item from "../item/item.js";
import { World } from "../world/World.js";
import { renderPath } from "../helper/canvashelper.js";

const MINING_PROGRESS_RADIUS_PX = 16;
const MINING_PROGRESS_COLOR = 16;

export default class MiningAction {
    #timer = 0;
    finished = false;
    actionFinishedSubject = new Observable();
    static tileMinedSubject = new Observable();

    /**
     * @param {Tile} tile
     * @param {Item} item Item used to mine
     */
    constructor(tile, item) {
        this.tile = tile;

        this.item = item ?? null;
        this.toolType = item?.toolType ?? null;
        this.miningLevel = item?.miningLevel ?? 0;

        this.totalTime = this.tile.miningTime * 1000;

        if(item?.miningSpeed && this.toolType === tile.toolType) {
            this.totalTime = Math.floor(this.totalTime / this.item.miningSpeed);
        }
    }

    get progressDecimal() { return this.#timer / this.totalTime }
    get progressPercent() { return Math.floor(this.progressDecimal * 100); }

    update(dt) {
        this.#timer += dt;
        if(this.#timer >= this.totalTime) this.#finish();
    }

    #finish() {
        this.finished = true;
        this.actionFinishedSubject.notify({ tile: this.tile, item: this.item });
        MiningAction.tileMinedSubject.notify( { tile: this.tile, item: this.item });
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Tile} tile
 * @param {number} progressDecimal
 */
export function renderMiningProgress(ctx, tile, progressDecimal) {
    const rads = 1.5 + progressDecimal * 2, cx = tile.centerX, cy = tile.centerY;

    renderPath(ctx, () => {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - MINING_PROGRESS_RADIUS_PX);
        ctx.arc(cx, cy, MINING_PROGRESS_RADIUS_PX, 1.5 * Math.PI, rads * Math.PI);
        ctx.lineTo(cx, cy);
        ctx.fill();
    })
}