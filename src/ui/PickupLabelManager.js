import { FadingText } from "./FadingText.js";

const LABEL_DURATION_MS = 1500;
const LABEL_HEIGHT_PX = 24;
const LABEL_FADE_DELTA = 0.03;
const LABEL_FONT_SIZE = 24;

export class PickupLabelManager {
    /** @type {PickupLabel[]} */
    labels = [];
    
    // Increment the frame counters for all visible labels
    update({ deltaTime }) {
        this.labels.forEach((label, i) => {
            label.update(deltaTime);
            if(label.fade <= 0) {
                this.labels.splice(i, 1);
            }
        })
    }

    // When an item is picked up that doesn't currenty have a label, add a new one to the list.
    add({ item, amount }) {
        const existing = this.labels.find(lbl => lbl.item === item);

        if(existing != null) {
            this.#updateLabel(existing, amount);
        } else {
            this.labels.unshift(new PickupLabel(item, amount));
        }
    }

    #updateLabel(label, amount) {
        const index = this.labels.indexOf(label);
        this.labels.splice(index, 1);
        label.increaseCount(amount);
        this.labels.unshift(label);
    }

    render({ ctx, player }) {
        this.labels.forEach((label, i) => {
            let x = player.centerX;
            let y = player.y - (LABEL_HEIGHT_PX * (i + 1));
            label.render(ctx, x, y);
        });
    }
}

class PickupLabel extends FadingText {
    constructor(item, count) {
        super(LABEL_DURATION_MS);

        this.style.fontSize = LABEL_FONT_SIZE;
        this.style.textColor = item.textColor;
        this.fadeDelta = LABEL_FADE_DELTA;
        this.item = item;
        this.itemName = item.displayName;
        this.count = count;

        this.resetFade();
    }

    get text() {
        return `${this.itemName} (${this.count})`;
    }

    increaseCount(n) {
        this.count += n;
        this.resetFade();
    }
}