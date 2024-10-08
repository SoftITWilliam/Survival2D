
/**
 * helper.js
 * 
 * A random collection of useful functions that don't really fit anywhere else
 */

import FastNoiseLite from "fastnoise-lite";
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
export function splitIntoLines(string, maxWidth) {

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

/**
 * Returns true if all values in args are valid numbers
 * @param  {...any} args 
 * @returns {boolean}
 */
export function validNumbers(...args) {
    return Array.from(args).filter(arg => 
            typeof arg != "number" || 
            arg == NaN)
        .length === 0
}

/**
 * Returns true if all values in args are positive integers
 * @param  {...any} args 
 * @returns {boolean}
 */
export function isPositiveInteger(...args) {
    return Array.from(args).filter(arg => 
            typeof arg != "number" || 
            arg == NaN || 
            arg < 0 || 
            !Number.isInteger(arg))
        .length === 0
}

/**
 * Returns true if the object has all the given properties
 * @param {object} object 
 * @param  {...string} properties 
 * @returns {boolean}
 */
export function objectHasProperties(object, ...properties) {
    return (typeof object == "object" && Array.from(properties).filter(
        p => Object.keys(object).indexOf(p) === -1).length === 0)
}

/**
 * @param {object} obj
 * @param {any} value
 * @returns {boolean}
 */
export function objectHasValue(obj, value) {
    return (typeof obj != "object" && Object.values(obj).indexOf(value) > -1);
}

/**
 * Takes a deltaTime value (ms) and converts it to a 'physics multiplier' relative to 60fps.
 * Used to make physics that were originally written for 60 fps work with different framerates.
 * @param {number} deltaTime Time since last frame (ms)
 * @returns {number}
 * @example
 * var dt = 1000 / 30; // 30 fps
 * getPhysicsMultiplier(dt); // returns 2
 *
 * var dt = 1000 / 60; // 60 fps
 * getPhysicsMultiplier(dt); // returns 1
 *
 * var dt = 1000 / 144; // 144 fps
 * getPhysicsMultiplier(dt); // returns 0.41666666666666663
 *
 * var dt = 1000 / 240; // 240 fps
 * getPhysicsMultiplier(dt) // returns 0.25
 */
export function getPhysicsMultiplier(deltaTime) {
    if(!validNumbers(deltaTime)) return 1;
    else return (deltaTime / (1000 / 60));
}

export async function timer(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    })
}

export function sum(numbers) {
    let result = 0;
    if(Array.isArray(numbers) && numbers.every(n => typeof(n) == "number")) {
        result = numbers.reduce((a, b) => a + b, 0);
    }
    return isNaN(result) ? 0 : result;
}

export function padRect(rect, padding) {
    rect.x -= padding;
    rect.y -= padding;
    rect.width += padding * 2;
    rect.height += padding * 2;
}

/**
 * @param {FastNoiseLite} noise 
 * @param {number} height 
 * @param {number} width 
 * @returns {number[][]}
 */
export function getNoiseData(noise, height, width) {

    let noiseData = [];

    for (let x = 0; x < width; x++) {
        noiseData[x] = [];

        for (let y = 0; y < height; y++) {        
            noiseData[x][y] = noise.GetNoise(x, y);
        }
    }
    return noiseData;
}