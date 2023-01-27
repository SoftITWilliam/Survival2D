import { ctx } from "../../game/global.js";
import UIComponent from "./UIComponent.js";


/**
 * A component primarily intended to contain a single piece of text
 */

export class TextComponent extends UIComponent {
    constructor(game, attributes) {
        super(game, attributes);
        this.setSize(0,0);
        this.setTextAttribute("textBaseline","middle");
    }

    // Overriding default function
    getHeight() {
        return this.getTextHeight();
    }

    // Overriding default function
    getWidth() {
        return this.getTextWidth();
    }
}