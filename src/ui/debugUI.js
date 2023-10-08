
import { rgba } from '../helper/canvashelper.js';

const DEFAULT_ROW_HEIGHT_PX = 32,
      DEFAULT_FONT_SIZE_PX = 20,
      DEFAULT_TEXT_OPACITY = 0.8;

/**
 * @typedef {object} row
 * @property {string} title
 * @property {() => (string|number|object)} valueFn
 */

export class DebugUI {
    #rows;
    constructor() {
        this.#rows = [];

        /** Default: 32 @type {number}  */
        this.rowHeightPx = DEFAULT_ROW_HEIGHT_PX;

        /** Default: 0.8 @type {number}  */
        this.alpha = DEFAULT_TEXT_OPACITY;

        /** Default: 20 @type {number} */
        this.fontSizePx = DEFAULT_FONT_SIZE_PX;
    }

    /**
     * @param {string} title 
     * @param {() => (string|number|object)} valueFn 
     * @returns 
     */
    addInfoRow(title, valueFn) {
        this.#rows.push({ title, valueFn });
        return this;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Game} game 
     */
    render(ctx, game) {
        let fillStyle = rgba({ r: 255, g: 255, b: 255, a: this.alpha }),
            font = `${this.fontSizePx}px Font1`;

        Object.assign(ctx, {
            fillStyle, font, textAlign: "left", textBaseline: "middle",
        })

        const x = game.player.camera.x + this.rowHeightPx;
        const y = game.player.camera.y + this.rowHeightPx;

        ctx.shadow("black", 5, 2, 2);

        this.#rows.forEach((row, index) => {
            const value = row.valueFn();
            
            let text = `${row.title}: `;

            if(typeof value == "object") {
                const valueArr = [];
                for(const key in value) {
                    valueArr.push(`${key}: ${value[key]}`);
                }
                text += `(${valueArr.join(", ")})`;
            } else {
                text += value ?? "-";
            }

            ctx.fillText(text, x, y + (this.rowHeightPx * index));
        });

        ctx.shadow();
    }
}