import { clamp, objectHasProperties, validNumbers } from "./helper.js";

/**
 * @typedef {object} rgb
 * @property {number} r Red (0-255)
 * @property {number} g Green (0-255)
 * @property {number} b Blue (0-255)
 */

/**
 * @typedef {object} rgba
 * @property {number} r Red (0-255)
 * @property {number} g Green (0-255)
 * @property {number} b Blue (0-255)
 * @property {number} a Alpha / Opacity (0-1)
 */

/**
 * Take an RGB object and format its values into a string usable by the canvas
 * @overload
 * @param {rgb} rgbColor 
 * @example
 * // returns "rgb(200,50,50)"
 * rgb({r: 200, g: 50, b: 50});
 * @returns {string} RGB string usable by canvas
 */
/**
 * Take RGB values and format into a string usable by the canvas
 * @overload
 * @param {number} r Red (0-255)
 * @param {number} g Green (0-255)
 * @param {number} b Blue (0-255)
 * @example
 * // returns "rgb(200,50,50)"
 * rgb(200, 50, 50);
 * @returns {string} RGB string usable by canvas
 */
export function rgb(arg1, arg2, arg3) {
    if(validNumbers(arg1, arg2, arg3)) 
        var color = { r: arg1, g: arg2, b: arg3 };

    else if (typeof arg1 == "object" && objectHasProperties(arg1, "r", "g", "b"))
        var color = arg1;

    else
        return "rgb(0,0,0)";

    return `rgb(${color.r},${color.g},${color.b})`;
}

/**
 * Take an RGBA object and format its values into a string usable by the canvas
 * @param {rgba} color RGBA object (contanins properties r, g, b, a)
 * @example
 * // returns "rgba(255,255,255,0.5)"
 * rgba({r: 255, g: 255, b: 255, a: 0:5})
 * @returns {string} RGBA string usable by canvas
 * //**
 * @overload
 * @param {rgb} color RGB object (contanins properties r, g, b)
 * @param {number} alpha Alpha / Opacity (0-1)
 * @example
 * // returns "rgba(255,255,255,0.5)"
 * rgba({r: 255, g: 255, b: 255}, 0.5})
 * @returns {string} RGBA string usable by canvas
 * //**
 * @overload
 * @param {number} r Red (0-255)
 * @param {number} g Green (0-255)
 * @param {number} b Blue (0-255)
 * @param {number} alpha Alpha / Opacity (0-1)
 * @example
 * // returns "rgba(255,255,255,0.5)"
 * rgba(255, 255, 255, 0.5})
 * @returns {string} RGBA string usable by canvas
 */
export function rgba(...args) {

    var rgbaString = (r, g, b, alpha) => {
        if(!validNumbers(alpha)) alpha = 0;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    if(args.length == 1 && objectHasProperties(args[0], "r", "g", "b")) {
        return rgbaString(args[0].r, args[0].g, args[0].b, args[0].a);
    }
    else if(args.length == 2 && objectHasProperties(args[0], "r", "g", "b")) {
        return rgbaString(args[0].r, args[0].g, args[0].b, args[1]);
    }
    else if(args.length >= 3 && validNumbers(...args)) {
        return rgbaString(args[0], args[1], args[2], args[3] ?? 0);
    }
    return "rgba(0,0,0,0)";
}

/**
 * Take an object of RGB values and a brightness multiplier and format into a string usable by the canvas - ex. {r:50,g:50,b:50}, 1.5 => "rgb(75,75,75)"
 * @param {object} color RGB object (ex. {r:50,g:50,b:50})
 * @param {object} values RGB object (ex. {r:50,g:50,b:50})
 * @returns 
 */
export function rgbm(color, brightness) {
    if(!color) return "rgb(0,0,0)";
    rgba()

    let r = clamp(color.r * brightness, 0, 255);
    let g = clamp(color.g * brightness, 0, 255);
    let b = clamp(color.b * brightness, 0, 255);   

    return `rgb(${r},${g},${b})`;
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