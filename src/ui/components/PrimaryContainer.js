
import UIComponent from "./UIComponent.js";

/**
 * A component which centers itself on the screen, and is intended to contain all other UI components.
 */

export class PrimaryContainer extends UIComponent {
    constructor(game, attributes) {
        super(game, attributes);

        this.alignChildren("spaceEvenly","row");
        this.setCentering(true,true);
    }
}