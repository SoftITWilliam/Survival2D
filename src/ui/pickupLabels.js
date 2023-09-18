import { rgba } from "../helper/canvashelper.js";
import { getPhysicsMultiplier } from "../helper/helper.js";
import { Player } from "../player/player.js";

const LABEL_DURATION_MS = 2000;
const LABEL_HEIGHT_PX = 24;
const LABEL_FADE_DELTA = 0.05;
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
            if(this.labels[i].alpha <= 0) {
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
                label.increaseItemCounter(amount);
                this.labels.unshift(label);
                return true;
            }
        }
        return false;
    }

    render(ctx, player) {
        for(let i = 0; i < this.labels.length; i++) {
            let yPos = (i * LABEL_HEIGHT_PX) + 16;
            this.labels[i].render(ctx, player, yPos);
        }
    }
}

class PickupLabel {
    #amount
    #timer
    #fade
    constructor(item, amount) {
        this.item = item;

        this.#amount = amount;
        this.#timer = LABEL_DURATION_MS;
        this.#fade = 1;
    }

    get itemName() {
        return this.item.displayName;
    }

    get textColor() {
        return this.item.textColor;
    }

    get amount() {
        return this.#amount;
    }

    resetDuration() {
        this.#timer = LABEL_DURATION_MS;
        this.#fade = 1;
    }

    update(deltaTime) {
        this.#timer -= deltaTime;
        if(this.#timer <= 0) {
            this.#fade -= LABEL_FADE_DELTA * getPhysicsMultiplier(deltaTime);
        }
    }

    increaseItemCounter(amount) {
        this.#amount += amount;
        this.resetDuration();
    }
    
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Player} player 
     * @param {number} yPos 
     */
    render(ctx, player, yPos) {
        let clrFill = rgba(this.textColor, this.#fade);
        let clrStroke = `rgba(0,0,0,${this.#fade})`;
        let font = LABEL_FONT_SIZE * this.#fade + "px Font1";

        Object.assign(ctx, {
            fillStyle: clrFill, strokeStyle: clrStroke,
            font: font, lineWidth: 5, textAlign: "center",
        });

        let x = player.centerX;
        let y = player.y - yPos;

        ctx.drawOutlinedText(`${this.itemName} (${this.amount})`, x, y);
    }
}