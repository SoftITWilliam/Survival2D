import { loadAssets } from "../graphics/assets.js";
import { timer } from "../helper/helper.js";
import { Game } from "./game.js";

const $overlay = $('.loading-overlay');
const $overlayText = $overlay.find('p');
const $overlaySpinner = $overlay.find('.lds-dual-ring');

/**
 * @param {Game} game 
 * @param {Function} onCompleted 
 */
export async function loadGame(game, onCompleted) {
    await document.fonts.ready;

    $overlayText.text("Loading assets...");

    // These timers give the texts time to update. 
    // Otherwise the 'await' starts and the text gets stuck. 
    // Very strange bug!
    await timer(50);
    await loadAssets();
    await timer(50);

    $overlayText.text("Generating world...");

    await timer(50);
    await game.world.generate();
    await timer(50);
    
    $overlayText.text("Let there be light...");

    await timer(50);
    await game.world.lighting.initialize();
    await timer(50);

    $overlayText.text("Loading complete!");
    
    setTimeout(() => {
        $overlay.css('background-color', 'transparent');
        $overlay.css('color', 'transparent');
        $overlaySpinner.addClass('d-none');

        setTimeout(() => { $overlay.css('display', 'none') }, 2000);
        onCompleted();
    }, 500);
}