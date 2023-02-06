import { clamp } from "../../misc/util.js";
import { ctx, TILE_SIZE } from "../global.js";

/**
 * Take an object of RGB values and format into a string usable by the canvas - ex. {r:50,g:50,b:50} => "rgb(50,50,50)"
 * @param {object} v RGB object (ex. {r:50,g:50,b:50})
 * @returns 
 */
export function rgb(col) {
    if(!col) {
        return "rgb(0,0,0)";
    }
    return `rgb(${col.r},${col.g},${col.b})`;
}

/**
 * Take an object of RGB values and a brightness multiplier and format into a string usable by the canvas - ex. {r:50,g:50,b:50}, 1.5 => "rgb(75,75,75)"
 * @param {object} values RGB object (ex. {r:50,g:50,b:50})
 * @returns 
 */
export function rgbm(col, brightness) {
    if(!col) {
        return "rgb(0,0,0)";
    }

    let r = clamp(col.r * brightness, 0, 255);
    let g = clamp(col.g * brightness, 0, 255);
    let b = clamp(col.b * brightness, 0, 255);   
    return `rgb(${r},${g},${b})`;
}


/**
 * Take an object of RGB values and an alpha value and format into a string usable by the canvas - ex. {r:0,g:0,b:0}, 0.5 => "rgba(50,50,50)"
 * @param {object} values RGB object (ex. {r:50,g:50,b:50})
 *  * @param {Number} alpha Opacity given as separate argument. (0 < alpha < 1)
 * @returns 
 */
export function rgba(col,alpha) {
    return `rgba(${col.r},${col.g},${col.b},${alpha})`;
}

/**
 * Take an item object, and render it on the canvas.
 * If the sprite is incorrect, a "missing texture" is drawn instead.
 * @param {Object} item 2
 */
export function renderItem(item,x,y,w,h) {

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
export function renderPath(func) {
    ctx.beginPath();
    func();
    ctx.closePath();
}