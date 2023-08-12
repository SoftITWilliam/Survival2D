import UIElement from "./UIElement.js";

/**
 * An element primarily intended to contain a single piece of text
 */

export class TextElement extends UIElement {
    constructor(game, attributes) {
        super(game, attributes);
        this.setSize(0, 0);
        this.setTextAttribute("textBaseline", "middle");
    }

    // Overriding default function
    get height() { return this.getTextHeight() }

    // Overriding default function
    get width() { return this.getTextWidth() }
}