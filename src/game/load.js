import { loadAssets } from "../graphics/assets.js";
import { timer } from "../helper/helper.js";

const $overlay = $(".loading-overlay");
const $overlayText = $overlay.find("p");

export async function loadGame(game) {
    return new Promise(async (resolve) => {

        await document.fonts.ready;

        $overlayText.text("Loading assets...");

        await timer(100);
        await loadAssets();
        await timer(100);

        $overlayText.text("Generating world...");
        await game.world.generate();

        await timer(250);

        $overlayText.text("Let there be light...");
        await game.world.lighting.initialize();

        await timer(100);

        $overlayText.text("Loading complete!");

        setTimeout(() => {
            $overlay.css("display", "none");
            resolve();
        }, 500);
    })
}