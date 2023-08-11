import render from "./graphics/render.js";
import { canvas } from "./global.js";
import { Game } from "./game.js";

const game = new Game();

window.onload = init();

let previousTime = 0;

function init() {
    setCanvasSize();
    game.world.generate();
    game.testing.run();
    game.player.spawn();
    window.requestAnimationFrame(gameLoop);
}

// Set canvas to cover whole screen
function setCanvasSize() {
    canvas.setAttribute("height",Math.round(window.innerHeight));
    canvas.setAttribute("width",Math.round(window.innerWidth));
}

function gameLoop(timestamp) {
    // Calculate time since last frame
    const deltaTime = timestamp - previousTime
    previousTime = timestamp;

    game.update(deltaTime);
    render(game,game.player);
    window.requestAnimationFrame(gameLoop);
}