import { renderItem } from "../../helper/canvashelper.js";
import { ImageElement } from "./ImageElement.js";

/**
 * UI Element which displays the sprite of an in-game item.
 */

export class ItemElement extends ImageElement {
    constructor(game, attributes) {
        super(game, attributes);

        this.item = attributes.item ? attributes.item : null;
    }

    setItem(item) {
        this.item = item;
    }

    render(ctx) {
        if(this.item) {
            renderItem(ctx, this.item, this.x, this.y, this.w, this.h);
        }
    }
}