import { validNumbers } from "../../helper/helper.js";

export class SpriteRenderer {
    #sx;
    #sy;
    constructor(source = null) {
        if(source instanceof Image) {
            this.source = source;
        }

        this.#sx;
        this.#sy;

        this.sheetX = 0;
        this.sheetY = 0;

        this.height = 0;
        this.width = 0;
    }

    //#region Getters

    get sx() {
        return this.#sx || (this.sheetX * this.width);
    }

    get sy() {
        return this.#sy || (this.sheetY * this.height);
    }

    //#endregion

    //#region Setters

    /**
     * Set sprite source image
     * @param {Image} source Sprite source image
     * @returns {SpriteRenderer} this
     */
    setSource(source) {
        if(source instanceof Image) {
            this.source = source;
        } else {
            console.warn("SpriteRenderer.setSource(): 'source' is not a valid image");
        }
        return this;
    }

    /** 
     * Set sprite offset in pixels
     */
    setSourcePosition(sx, sy) {
        this.#sx = sx;
        this.#sy = sy;
        return this;
    }

    /** 
     * Set position in spritesheet.
     * Offset is automatically calculated using sprite size
     */
    setSheetPosition(sheetX, sheetY) {
        this.sheetX = sheetX;
        this.sheetY = sheetY;
        return this;
    }

    setSpriteSize(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    //#endregion

    //#region Rendering methods

    /**
     * Render sprite at given canvas coordinates
     * @overload
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     */

    /**
     * Render sprite at given canvas coordinates.
     * If given size is smaller than the sprite size, the sprite will 
     * automatically extend outside of the area, you do not need to
     * calculate the difference and adjust the coordinates
     * @overload
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width
     * @param {number} height
     */

    /**
     * Render sprite based of the position of an object.
     * If the object's size is smaller than the sprite size, the sprite will 
     * automatically extend outside its area, you do not need to
     * calculate the difference and adjust the coordinates
     * @overload
     * @param {CanvasRenderingContext2D} ctx 
     * @param {object} obj Must have properties x, y, width / w, and height / h
     */
    render(ctx, arg1, arg2, arg3, arg4) {

        var renderDefault = (x, y) => {
            ctx.drawImage(this.source, 
                this.sx, this.sy, 
                this.width, this.height,
                x, y,
                this.width, this.height);
        }

        var renderWithSize = (x, y, w, h) => {
            let widthDiff = this.width - w;
            let heightDiff = this.height - h;
            renderDefault(x - (widthDiff / 2), y - (heightDiff / 2));
        }

        var renderFromObject = (obj) => {
            let w = obj.w || obj.width;
            let h = obj.h || obj.height;
            if(validNumbers(obj.x, obj.y, w, h)) {
                renderWithSize(obj.x, obj.y, w, h);
            }
        }

        if(typeof arg1 == "object") {
            renderFromObject(arg1);
        }
        else if(arg3 == null || arg4 == null) {
            renderDefault(arg1, arg2);
        }
        else {
            renderWithSize(arg1, arg2, arg3, arg4);
        }
    }

    renderCentered(ctx, x, y) {
        this.render(ctx, x - (this.width / 2), y - (this.height / 2));
    }

    //#endregion
}