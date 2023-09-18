import { rgba } from "../helper/canvashelper.js";
import { getPhysicsMultiplier } from "../helper/helper.js";

export class FadingText {

    #duration
    constructor(duration) {
        this.timer = 0;
        this.fade = 0;

        this._text;

        this.style = {
            fontSize: 12,
            textColor: { r: 255, g: 255, b: 255 },
            scaleWhenFading: true,
            textAlign: "center",
            textBaseline: "middle",
        }

        this.#duration = duration;
        this.fadeDelta = 0.05;
    }
    
    get text() {
        return this._text;
    }

    // Can be overridden
    set text(value) {
        if(typeof value == "string") {
            this._text = value;
            this._onTextChanged();
        }
    }

    get font() {
        let size = this.style.fontSize;
        if(this.style.scaleWhenFading) size *= this.fade;
        return size + "px Font1";
    }

    // Subclasses may override this to add custom behaviour
    _onTextChanged() { }

    /**
     * Resets fade timer and text opacity
     */
    resetFade() {
        this.timer = this.#duration;
        this.fade = 1;
    }

    /**
     * Updates timer & text fade
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.timer -= deltaTime;
        if(this.timer <= 0) {
            this.fade -= this.fadeDelta * getPhysicsMultiplier(deltaTime);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x X coordinate on canvas
     * @param {number} y Y coordinate on canvas
     */
    render(ctx, x, y) {
        if(!this.text) return;

        let clrFill = rgba(this.style.textColor, this.fade);
        let clrStroke = `rgba(0,0,0,${this.fade})`;

        Object.assign(ctx, {
            fillStyle: clrFill, 
            strokeStyle: clrStroke,
            lineWidth: 5, 
            font: this.font, 
            textAlign: this.style.textAlign, 
            textBaseline: this.style.textBaseline,
        });

        ctx.drawOutlinedText(this.text, x, y);
    }
}