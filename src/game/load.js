import { loadAssets } from "../graphics/assets.js";

const $overlay = $(".loading-overlay");
const $overlayText = $overlay.find("p");

export async function loadGame(game) {
    return new Promise(async (resolve) => {

        document.fonts.addEventListener("loadingdone", async () => {
            $overlayText.text("Loading assets...");
            await loadAssets();

            //$overlayText.text("Creating world...");
            await game.world.generate();

            //$overlayText.text("Let there be light...");
            await game.world.lighting.initialize();

            $overlayText.text("Loading complete!");

            setTimeout(() => {
                $overlay.css("display", "none");
                resolve();
            }, 500);
        })
    })
}