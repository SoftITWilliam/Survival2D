import render from "../graphics/render.js";
import { canvas, ctx } from "./global.js";
import { Game } from "./game.js";
import { spawnPlayerInWorld } from "../player/player.js";
import { autoResizeCanvas } from "../misc/canvasSize.js";
import { loadGame } from "./load.js";

autoResizeCanvas(canvas);

var game;

let previousTime = 0;

window.onload = init();

async function init() {
    game = new Game();
    await loadGame(game);
    game.testing.run();
    spawnPlayerInWorld(game.player, game.world);
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    // Calculate time since last frame
    const deltaTime = timestamp - previousTime
    previousTime = timestamp;

    game.update(deltaTime);
    render(ctx, game, game.player);
    window.requestAnimationFrame(gameLoop);
}