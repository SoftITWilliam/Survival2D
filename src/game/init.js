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
    loadGame(game, () => {
        game.testing.run();
        spawnPlayerInWorld(game.player, game.world);
        window.requestAnimationFrame(gameLoop);
    });
}

function gameLoop(timestamp) {
    // Calculate time since last frame
    const deltaTime = previousTime > 0 ? timestamp - previousTime : 0;
    previousTime = timestamp;

    game.update(deltaTime);
    game.render(ctx);
    window.requestAnimationFrame(gameLoop);
}