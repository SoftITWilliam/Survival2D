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
 * Wrapper for ctx.beginPath() & ctx.closePath();
 */
export function renderPath(ctx, renderingFunction) {
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

/* === ctx extension methods === */

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

const getRect = (object, padding) => {
    return {
        x: (object.x || object.xPos || 0) - padding,
        y: (object.y || object.yPos || 0) - padding,
        w: (object.width || object. w || 0) + padding * 2,
        h: (object.height || object.h || 0) + padding * 2,
    }
}

CanvasRenderingContext2D.prototype.fillRectObj = function(object, padding = 0) {
    let rect = getRect(object, padding);
    this.fillRect(rect.x, rect.y, rect.w, rect.h);
}

CanvasRenderingContext2D.prototype.rectObj = function(object, padding = 0) {
    let rect = getRect(object, padding);
    this.rect(rect.x, rect.y, rect.w, rect.h);
}