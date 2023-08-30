import { TILE_SIZE, ctx } from "../game/global.js";
import { clamp } from "./helper.js";

/**
 * Take an object of RGB values and format into a string usable by the canvas - ex. {r:50,g:50,b:50} => "rgb(50,50,50)"
 * @param {object} color RGB object (ex. {r:50,g:50,b:50})
 * @returns 
 */
export function rgb(color) {
    if(!color) return "rgb(0,0,0)";

    return `rgb(${color.r},${color.g},${color.b})`;
}

/**
 * Take an object of RGB values and a brightness multiplier and format into a string usable by the canvas - ex. {r:50,g:50,b:50}, 1.5 => "rgb(75,75,75)"
 * @param {object} color RGB object (ex. {r:50,g:50,b:50})
 * @param {object} values RGB object (ex. {r:50,g:50,b:50})
 * @returns 
 */
export function rgbm(color, brightness) {
    if(!color) return "rgb(0,0,0)";

    let r = clamp(color.r * brightness, 0, 255);
    let g = clamp(color.g * brightness, 0, 255);
    let b = clamp(color.b * brightness, 0, 255);   

    return `rgb(${r},${g},${b})`;
}


/**
 * Take an object of RGB values and an alpha value and format into a string usable by the canvas - ex. {r:0,g:0,b:0}, 0.5 => "rgba(50,50,50)"
 * @param {object} color RGB object (ex. {r:50,g:50,b:50})
 *  * @param {Number} alpha Opacity given as separate argument. (0 < alpha < 1)
 * @returns 
 */
export function rgba(color, alpha) {
    return `rgba(${color.r},${color.g},${color.b},${alpha})`;
}

/**
 * Take an item object, and render it on the canvas.
 * If the sprite is incorrect, a "missing texture" is drawn instead.
 * @param {Object} item 2
 */
export function renderItem(item, x, y, w, h) {

    if(!item.sprite || item.sx === undefined || item.sy === undefined) {
        console.log("Cannot draw item");
        return;
    }

    ctx.drawImage(
        item.sprite,
        item.sx, item.sy, TILE_SIZE, TILE_SIZE,
        x, y, w, h
    );
}

/**
 * Wrapper for ctx.beginPath() & ctx.closePath();
 */
export function renderPath(renderingFunction) {
    ctx.beginPath();
    renderingFunction();
    ctx.closePath();
}

export function drawRounded(x, y, width, height, radius, ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
}

// === ctx extension methods ===

CanvasRenderingContext2D.prototype.drawOutlinedText = function(text, x, y) {
    this.strokeText(text, x, y);
    this.fillText(text, x, y);
}

/**
 * Set canvas shadow styling
 * @param {string} color 
 * @param {number} blur 
 * @param {number} offsetX 
 * @param {number} offsetY 
 */
CanvasRenderingContext2D.prototype.shadow = function(color = 0, blur = 0, offsetX = 0, offsetY = 0) {
    Object.assign(this, { 
        shadowColor: color, 
        shadowBlur: blur,
        shadowOffsetX: offsetX, 
        shadowOffsetY: offsetY, 
    });
}