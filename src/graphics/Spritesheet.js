import { validNumbers } from "../helper/helper.js";


export class Spritesheet {
    /**
     * @param {object} params
     * @param {HTMLImageElement} params.source
     * @param {number} params.spriteWidth width in px
     * @param {number} params.spriteHeight height in px
     */
    constructor({ source, spriteWidth, spriteHeight }) {
        if(!source instanceof HTMLImageElement || !validNumbers(spriteWidth, spriteHeight)) {
            throw new TypeError();
        } 
        this.source = source;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }

    get sheetWidth() {
        return Math.floor(this.source.width / this.spriteWidth);
    }

    get sheetHeight() {
        return Math.floor(this.source.height / this.spriteHeight);
    }

    /**
     * @param {number} frameX 
     * @param {number} frameY 
     * @returns {{x: number, y: number}}
     */
    getFramePosition(frameX, frameY) {
        if(frameX < 0 || frameY < 0 || frameX > this.sheetWidth || frameY > this.sheetHeight) {
            throw new RangeError();
        }
        return {
            x: frameX * this.spriteWidth,
            y: frameY * this.spriteHeight,
        }
    }
}