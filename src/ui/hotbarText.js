import Item from "../item/item.js";
import { Player } from "../player/player.js";
import { FadingText } from "./FadingText.js";

const TEXT_DURATION_MS = 1000;

export class HotbarText extends FadingText {
    constructor() {
        super(TEXT_DURATION_MS);
        this.style.fontSize = 28;
        this.fadeDelta = 0.02;
    }

    /**
     * @param {Item} item
     */
    set item(item) {
        this.text = item.displayName;
    }

    /**
     * @override
     */
    _onTextChanged() {
        this.resetFade();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Player} player 
     */
    render(ctx, player) {
        if(!player.inventory.view) {
            super.render(ctx, player.camera.centerX, player.camera.y2 - 120);
        }
    }
}