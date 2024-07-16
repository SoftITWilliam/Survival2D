import { renderPath } from '../helper/canvashelper.js';
import { AlignmentX, AlignmentY, getAlignedX, getAlignedY } from '../misc/alignment.js';
import PlayerCamera from './camera.js';


export class StatBar { 
    #value = 0;

    /**
     * @param {number} max 
     * @param {number} startValue 
     * @param {StatBarRenderer} renderer 
     */
    constructor(max, startValue, renderer) {
        this.max = max;
        this.value = startValue;
        this.renderer = renderer;
    }

    get value() {
        return this.#value;
    }
    set value(v) {
        console.assert(typeof v === 'number' && !isNaN(v), 'Invalid type');
        this.#value = v;
    }

    increaseBy(amount) {
        console.assert(typeof amount === 'number' && !isNaN(amount), 'Invalid type');
        console.assert(amount >= 0, 'Can not be negative');
        this.value = Math.max(this.value + amount, this.max);
    }

    decreaseBy(amount) {
        console.assert(typeof amount === 'number' && !isNaN(amount), 'Invalid type');
        console.assert(amount >= 0, 'Can not be negative');
        this.value = Math.max(this.value - amount, 0);
    }
}

export class StatBarRenderer { 

    alignX = AlignmentX.RIGHT;
    alignY = AlignmentY.TOP;

    offsetX = 0;
    offsetY = 0;

    width = 0;
    height = 24;

    borderColor = 'rgb(0, 0, 0)';
    borderWidthPx = 3;
    backgroundColor = 'rgba(0, 0, 0, 0.6)';

    barColor = 'rgb(120, 120, 120)';

    textColor = 'rgb(255, 255, 255)';
    fontSize = '20px';

    get #font() {
        return `${this.fontSize} Font1`;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} max 
     * @param {number} value 
     * @param {PlayerCamera} camera 
     */
    render(ctx, max, value, camera) {

        const lineWidth = 3;
        ctx.lineWidth = lineWidth;

        const x = getAlignedX(camera.x, camera.width, this.width, this.alignX) + this.offsetX;
        const y = getAlignedY(camera.y, camera.height, this.height, this.alignY) + this.offsetY;

        ctx.globalAlpha = 1;

        /*
        renderPath(ctx, () => {
            ctx.strokeStyle = this.outerBorderColor;
            ctx.rect(x, y, barLength + 6, this.height + 6);
            ctx.stroke();
        })
        
        renderPath(ctx, () => {
            ctx.strokeStyle = this.innerBorderColor;
            ctx.fillStyle = this.backgroundColor;
            ctx.rect(x + 3, y + 3, barLength, this.height);
            ctx.fill();
            ctx.stroke();
        })
        */

        // Outline
        renderPath(ctx, () => {
            const offset = this.borderWidthPx / 2;
            const w = this.width + offset * 2;
            const h = this.height + offset * 2;
            ctx.roundRect(x - offset, y - offset, w, h, h / 2);
            Object.assign(ctx, { strokeStyle: this.borderColor, lineWidth: this.borderWidthPx });
            ctx.stroke();
        });

        // Background
        renderPath(ctx, () => {
            ctx.fillStyle = this.backgroundColor;
            ctx.roundRect(x, y, this.width, this.height, this.height / 2);
            ctx.fill();
        });

        // Bar filling
        renderPath(ctx, () => {
            const percentage = value / max;

            ctx.fillStyle = this.barColor;
            ctx.roundRect(x, y, this.width, this.height, this.height / 2);
            ctx.save();
            ctx.clip();
            ctx.fillRect(x, y, this.width * percentage, this.height);
            ctx.restore();

            // Text
            Object.assign(ctx, { 
                fillStyle: this.textColor, 
                font: this.#font, 
                textAlign: 'center', 
                textBaseline: 'middle',
                strokeStyle: this.borderColor,
                lineWidth: this.borderWidthPx,
            });
            const text = value + '/' + max;
            const middleX = x + (this.width / 2);
            const middleY = y + (this.height / 2);
            ctx.drawOutlinedText(text, middleX, middleY);
            ctx.fillText(text, middleX, middleY);
        });
    }
}