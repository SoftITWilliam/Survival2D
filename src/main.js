import draw from "./game/draw.js";
import { loadWorld, updateTiles } from "./world/world.js";
import { player } from "./player/player.js";
import { canvas } from "./game/const.js";
import { updateItemEntities } from "./world/item/itemEntity.js";
import { incrementFPS } from "./FPScounter.js";

window.onload = init();

function init() {
    setCanvasSize();
    loadWorld();
    updateTiles();

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
    draw();

    window.requestAnimationFrame(gameLoop);
}
