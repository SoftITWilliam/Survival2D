
/**
 * utility.js
 * 
 * A random collection of useful functions that don't really fit anywhere else
 */

import { ctx, PATH, TILE_SIZE, WORLD_WIDTH } from "./game/const.js";


/**
 * Return a random number between the two points
 * @param {int}     min     Minimum value
 * @param {int}     max     Maximum value
 * @returns {int}
 */
export function rng(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Takes a number. Forces the number to be within the given range, then returns it.
 * @param {int}     num     The number
 * @param {int}     min     Minimum value
 * @param {int}     max     Maximum value
 * @returns {int}
 */
export function clamp(num,min,max) {
    return Math.min(Math.max(num, min), max);
}

export function setAttributes(object,attributes) {
    for(let a in attributes) {
        object[a] = attributes[a];
    }
}

export function swapBool(bool) {
    if(bool) {
        return false;
    }
    return true;
}

export const image = (src) => {
    let img = new Image;
    try {
        img.src = PATH + src + ".png";
    } catch {
        img.src = "assets/missing_texture.png";
    } finally {
        return img;
    }
}

export function calculateDistance(obj1,obj2) {
    let a = Math.max(obj1.centerX,obj2.centerX) - Math.min(obj1.centerX,obj2.centerX);
    let b = Math.max(obj1.centerY,obj2.centerY) - Math.min(obj1.centerY,obj2.centerY);
    let dist = Math.sqrt((a**2 + b**2));
    return dist;
}

export function mouseOn(object,mouse) {
    if(mouse.mapX > object.x && mouse.mapX < object.x + object.w &&
        -mouse.mapY > object.y && -mouse.mapY < object.y + object.h) {
            return true;
    } 
    return false;
}

/**
 * Takes an X coordinate and return its grid equivalent
 * @param {int}     x   canvas X coordinate
 * @returns {*}         grid X coordinate (false if outside grid)
 */
export function gridXfromCoordinate(x) {
    return Math.floor(x / TILE_SIZE);
}

/**
 * Takes an Y coordinate and return its grid equivalent
 * @param {int}     x   canvas X coordinate
 * @returns {int}       grid X coordinate (false if outside grid)
 */
export function gridYfromCoordinate(y) {
    return -Math.floor(y / TILE_SIZE);
}

export function limitCameraX(cameraX) {
    return clamp(cameraX,0,WORLD_WIDTH * TILE_SIZE - canvas.width)
}

export function drawRounded(x,y,width,height,radius,ctx) {
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

export function disableShadow(ctx) {
    setAttributes(ctx,{shadowOffsetX:0,shadowOffsetY:0,shadowColor:0,shadowBlur:0});
}

/**
 * Splits a string into an array of lines, where no 'line' is longer than the given width.
 * Used for drawing really long strings (ex. Item descriptions) on multiple lines
 * 
 * @param {string}  string      The string which should be split
 * @param {int}     maxWidth    The maximum length per line (in pixels)
 * @returns {array}             An array of strings. Every item
 */
export function splitIntoLines(string,maxWidth) {

    if(!string || isNaN(maxWidth) || maxWidth < 0) {
        return [];
    }

    let lines = [];
    let thisLine = "";
    let words = string.split(" ");

    // Keep adding words until it reaches its max width, then go to the next line.
    for(let i = 0; i < words.length; i++) {

        if(ctx.measureText(thisLine + words[i]).width > maxWidth) {
            lines.push(thisLine.substring(0,thisLine.length - 1));
            thisLine = "";
        }

        thisLine += words[i] + " ";
    }

    // Add the final line
    lines.push(thisLine.substring(0,thisLine.length - 1));

    return lines;
}

export function outOfBounds(x,y) {
    return (x < 0 && x >= WORLD_WIDTH && y < 0 && y >= WORLD_HEIGHT) ? true : false;
}