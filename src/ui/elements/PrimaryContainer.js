
import UIElement from "./UIElement.js";

/**
 * An element which centers itself on the screen, and is intended to contain all other UI elements.
 */

export class PrimaryContainer extends UIElement {
    constructor(game, attributes) {
        super(game, attributes);

        this.alignChildren("spaceEvenly","row");
        this.setCentering(true,true);
    }
}