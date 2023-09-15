
/**
 * helper.js
 * 
 * A random collection of useful functions that don't really fit anywhere else
 */

import { ctx } from "../game/global.js";

/**
 * Return a random number between the two points
 * @param {int} min Minimum value
 * @param {int} max Maximum value
 * @returns {int}
 */
export function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Has a 1 in (value) chance of returning true
 * @param {int} value 
 * @returns {boolean}
 */
export function roll(value) {
    return (rng(0, value) == value);
}

/**
 * Takes a number. Forces the number to be within the given range, then returns it.
 * @param {int} num The number
 * @param {int} min Minimum value
 * @param {int} max Maximum value
 * @returns {int}
 */
export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export function calculateDistance(obj1, obj2) {
    let a = Math.max(obj1.centerX, obj2.centerX) - Math.min(obj1.centerX, obj2.centerX);
    let b = Math.max(obj1.centerY, obj2.centerY) - Math.min(obj1.centerY, obj2.centerY);
    let distance = Math.sqrt(a ** 2 + b ** 2);
    return distance;
}

/**
 * Splits a string into an array of lines, where no 'line' is longer than the given width.
 * Used for drawing really long strings (ex. Item descriptions) on multiple lines
 * 
 * @param {string} string The string which should be split
 * @param {int} maxWidth The maximum length per line (in pixels)
 * @returns {array} An array of strings
 */
export function splitIntoLines(string,maxWidth) {

    if(!string || isNaN(maxWidth) || maxWidth < 0) return [];

    let lines = [];
    let thisLine = "";
    let words = string.split(" ");

    // Keep adding words until it reaches its max width, then go to the next line.
    for(let i = 0; i < words.length; i++) {

        if(ctx.measureText(thisLine + words[i]).width > maxWidth) {
            lines.push(thisLine.substring(0, thisLine.length - 1));
            thisLine = "";
        }

        thisLine += words[i] + " ";
    }

    // Add the final line
    lines.push(thisLine.substring(0, thisLine.length - 1));

    return lines;
}

/**
 * Calculate size of gaps between a number of equally sized items on a line.
 * If the sum of the items is greater than the total size, return 0.
 * @param {number} totalSize Total size of area
 * @param {number} size Item size
 * @param {number} amount Amount of items
 * @returns {number} Gap size
*/
export function getGap(totalSize, size, amount) {
    let gap = (totalSize - (size * amount)) / (amount + 1);
    return(gap > 0 ? gap : 0);
}

export function validIndex(index, array) {
    return (typeof index == "number" && index != NaN &&
            Array.isArray(array) &&
            index >= 0 && index < array.length);
}