import { Player } from "../player/player.js";
import { FadingText } from "./FadingText.js";

const LABEL_DURATION_MS = 1500;
const LABEL_HEIGHT_PX = 24;
const LABEL_FADE_DELTA = 0.03;
const LABEL_FONT_SIZE = 24;

export class PickupLabelManager {

    constructor() {
        /** @type {PickupLabel} */
        this.labels = [];
    }   

    // Increment the frame counters for all visible labels
    update(deltaTime) {
        for(let i = 0; i < this.labels.length; i++) {
            this.labels[i].update(deltaTime);
            if(this.labels[i].fade <= 0) {
                this.labels.splice(i, 1);
            }
        }
    }

    // When an item is picked up that doesn't currenty have a label, add a new one to the list.
    add(item, amount) {
        // Look for already existing label
        if(this.#findExisting(item, amount)) return;

        // If no existing label is found, add a new one.
        this.labels.unshift(
            new PickupLabel(item, amount)
        );
    }

    #findExisting(item, amount) {
        for(let i = 0; i < this.labels.length; i++) {

            // If existing label is found, its counter is increased and it's moved to the front of the list.
            if(this.labels[i].itemName == item.displayName) {
                const label = this.labels.splice(i, 1)[0];
                label.increaseItemCount(amount);
                this.labels.unshift(label);
                return true;
            }
        }
        return false;
    }

    render(ctx, player) {
        for(let i = 0; i < this.labels.length; i++) {
            let yPos = LABEL_HEIGHT_PX * (i + 1);
            this.labels[i].render(ctx, player, yPos);
        }
    }
}

class PickupLabel extends FadingText {
    constructor(item, count) {
        super(LABEL_DURATION_MS);

        this.style.fontSize = LABEL_FONT_SIZE;
        this.style.textColor = item.textColor;
        this.fadeDelta = LABEL_FADE_DELTA;
        this.itemName = item.displayName;
        this.itemCount = count;

        this.resetFade();
    }

    get text() {
        return `${this.itemName} (${this.itemCount})`;
    }

    increaseItemCount(n) {
        this.itemCount += n;
        this.resetFade();
    }
    
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Player} player 
     * @param {number} yPos 
     */
    render(ctx, player, yPos) {
        super.render(ctx, player.centerX, player.y - yPos);
    }
}