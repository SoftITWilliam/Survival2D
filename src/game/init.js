
// FIXED IMPORTS:
import render from "./graphics/render.js";
import { canvas } from "./global.js";
import { Game } from "./game.js";

const game = new Game();

window.onload = init();

function init() {
    setCanvasSize();
    game.player.spawn();
    window.requestAnimationFrame(gameLoop);
}

// Set canvas to cover whole screen
function setCanvasSize() {
    canvas.setAttribute("height",Math.round(window.innerHeight));
    canvas.setAttribute("width",Math.round(window.innerWidth));
}

function gameLoop() {
    game.update();
    render(game,game.player);
    window.requestAnimationFrame(gameLoop);
}