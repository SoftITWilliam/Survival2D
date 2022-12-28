
// FIXED IMPORTS:
import render from "./graphics/render.js";
import { player } from "../player/player.js";
import { canvas } from "./const.js";
import { loadWorld, updateTiles } from "../world/world.js";
import { updateItemEntities } from "../item/itemEntity.js";
import { incrementFPS } from "./graphics/FPScounter.js";
import { validateItems } from "../item/itemRegistry.js";

window.onload = init();

function init() {
    setCanvasSize();
    loadWorld();
    updateTiles();
    validateItems();

    player.spawn();
    window.requestAnimationFrame(gameLoop);
}

// Set canvas to cover whole screen
function setCanvasSize() {
    canvas.setAttribute("height",Math.round(window.innerHeight));
    canvas.setAttribute("width",Math.round(window.innerWidth));
}

function gameLoop() {
    incrementFPS();

    player.update();
    updateItemEntities();
    render();

    window.requestAnimationFrame(gameLoop);
}