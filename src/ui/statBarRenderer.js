import { renderPath } from "../helper/canvashelper.js";
import { AlignmentX, AlignmentY, getAlignedX, getAlignedY } from "../misc/alignment.js";

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

        ctx.lineWidth = this.borderWidthPx;

        const x = getAlignedX(camera.x, camera.width, this.width, this.alignX) + this.offsetX;
        const y = getAlignedY(camera.y, camera.height, this.height, this.alignY) + this.offsetY;

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