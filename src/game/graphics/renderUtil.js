import { ctx, TILE_SIZE } from "../global.js";

/**
 * Take an object of RGB values and format into a string usable by the canvas - ex. {r:50,g:50,b:50} => "rgb(50,50,50)"
 * @param {object} values RGB object (ex. {r:50,g:50,b:50})
 * @returns 
 */
export function rgb(values) {
    return "rgb(" + values.r + "," + values.g + "," + values.b + ")";
}


/**
 * Take an object of RGB values and an alpha value and format into a string usable by the canvas - ex. {r:0,g:0,b:0}, 0.5 => "rgba(50,50,50)"
 * @param {object} values RGB object (ex. {r:50,g:50,b:50})
 *  * @param {Number} alpha Opacity given as separate argument. (0 < alpha < 1)
 * @returns 
 */
export function rgba(values,alpha) {
    return "rgba(" + values.r + "," + values.g + "," + values.b + "," + alpha + ")";
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