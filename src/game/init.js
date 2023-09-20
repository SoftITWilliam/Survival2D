import render from "../graphics/render.js";
import { canvas, ctx } from "./global.js";
import { Game } from "./game.js";
import { spawnPlayerInWorld } from "../player/player.js";
import { autoResizeCanvas } from "../misc/canvasSize.js";

autoResizeCanvas(canvas);

const game = new Game();

window.onload = init();

let previousTime = 0;

function init() {
    game.world.generate();
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