
/**
 * const.js
 * 
 * Putting global constant variables in one place to avoid mutual dependencies
 */

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

export const TILE_SIZE = 48;
export const ITEM_SIZE = 16;

export const WORLD_WIDTH = 127;
export const WORLD_HEIGHT = 127;
export const BASE_TERRAIN_HEIGHT = 32;

export const INVENTORY_WIDTH = 6;
export const INVENTORY_HEIGHT = 4;

export const GRAVITY = 0.35;

export const PATH = "assets/";

export const DRAWDIST = {
    x: Math.floor(window.innerWidth / 2 / TILE_SIZE) + 1,
    y: Math.floor(window.innerHeight / 2 / TILE_SIZE) + 1,
}

// Debugging and testing variables
export const DRAW_LIGHTING = true;
export const DEBUG_MODE = true;


