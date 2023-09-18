import { rgba } from "../helper/canvashelper.js";
import { getPhysicsMultiplier } from "../helper/helper.js";
import Item from "../item/item.js";
import { Player } from "../player/player.js";

const TEXT_DURATION_MS = 1000;
const FONT_SIZE = 28;
const FADE_DELTA = 0.02;

export class HotbarText {
    #text
    #fade
    #timer
    constructor() {
        this.#text;
        this.#fade = 0;
        this.#timer = 0;
    }

    /**
     * @overload
     * @param {string} text 
     */
    /**
     * 
     * @overload
     * @param {Item} selectedItem
     */
    set(arg) {
        if(typeof arg == "string") {
            this.#text = arg;
            this.reset();
        }
        else if(arg instanceof Item) {
            this.#text = arg.displayName;
            this.reset();
        }
    }

    reset() {
        this.#timer = TEXT_DURATION_MS;
        this.#fade = 1;
    }

    update(deltaTime) {
        this.#timer -= deltaTime;
        if(this.#timer <= 0) {
            this.#fade -= FADE_DELTA * getPhysicsMultiplier(deltaTime);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Player} player 
     */
    render(ctx, player) {
        if(player.inventory.view) return;

        let clrFill = rgba(255, 255, 255, this.#fade);
        let font = FONT_SIZE * this.#fade + "px Font1";

        Object.assign(ctx, {
            font: font, textAlign: "center", fillStyle: clrFill
        });

        ctx.shadow("black", 4, 2, 2);

        let x = player.camera.centerX;
        let y = player.camera.y2 - 120;
        ctx.fillText(this.#text, x, y);

        ctx.shadow();
    }
}