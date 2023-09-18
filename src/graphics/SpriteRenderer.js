import { isPositiveInteger, validNumbers } from "../helper/helper.js";
import { AlignmentX, AlignmentY, getAlignedX, getAlignedY } from "../misc/alignment.js";
import { isMissingTexture, sprites } from "./assets.js";

export class SpriteRenderer {
    #sx;
    #sy;
    #width;
    #height;
    #source;
    constructor(source = null) {
        this.#source;

        this.#sx;
        this.#sy;

        this.sheetX = 0;
        this.sheetY = 0;

        this.#width = 0;
        this.#height = 0;

        this.alignX = AlignmentX.MIDDLE;
        this.alignY = AlignmentY.MIDDLE;

        this.scaleToFitSize = false;

        this.setSource(source, true);
    }

    //#region Getters

    get sx() {
        return this.#sx || (this.sheetX * this.width);
    }

    get sy() {
        return this.#sy || (this.sheetY * this.height);
    }

    get height() {
        return this.#height;
    }

    get width() {
        return this.#width;
    }

    get source() {
        return this.#source;
    }

    get hasMissingTexture() {
        return isMissingTexture(this.source);
    }

    //#endregion

    //#region Setters

    /**
     * Set sprite source image
     * @param {Image} source Sprite source image
     * @returns {SpriteRenderer} this
     */
    setSource(source, suppressWarnings = false) {

        var sourceError = (msg) => {
            this.#source = sprites.misc.missing_texture;
            if(!suppressWarnings)
                console.warn("SpriteRenderer.setSource(): " + msg);
        }

        if(source == null)
            sourceError("No source provided");

        else if(!source instanceof Image && !source.src)
            sourceError("'source' is not a valid image");

        else
            this.#source = source;
        
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

    /**
     * Set width and height of sprite
     * @overload
     * @param {number} width Sprite width
     * @param {number} height Sprite height
     * @returns 
     */
    /**
     * Set size of sprite (equal width and height)
     * @overload
     * @param {number} size Sprite size (Equal width and height)
     * @returns 
     */
    setSpriteSize(arg1, arg2) {
        if(isPositiveInteger(arg1)) {
            if(!isPositiveInteger(arg2)) arg2 = arg1;
            this.#width = arg1;
            this.#height = arg2;
        }
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
            if(!this.source instanceof Image) {
                console.warn("SpriteRenderer does not have a valid image");
                return;
            }
            ctx.drawImage(this.source, 
                this.sx, this.sy, 
                this.width, this.height,
                x, y,
                this.width, this.height);
        }

        var renderScaled = (x, y, w, h) => {
            ctx.drawImage(this.source, 
                this.sx, this.sy, 
                this.width, this.height,
                x, y, w, h);
        }

        var renderWithSize = (x, y, w, h) => {
            if(this.scaleToFitSize) {
                renderScaled(x, y, w, h);
                return;
            } 

            x = getAlignedX(x, w, this.width, this.alignX);
            y = getAlignedY(y, h, this.height, this.alignY);

            renderDefault(x, y);
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