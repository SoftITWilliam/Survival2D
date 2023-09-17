import { colors } from "../../graphics/colors.js";
import UIElement from "./UIElement.js";

export class CraftingSection extends UIElement {
    constructor(game, attributes) {
        super(game, attributes);
        this.x;
        this.y;

        this.setColor(colors.uiDark,colors.black);
    }

    updatePositionY() {
        this.y = this.floatDown() - this.parent.getChildSpacing("x");
    }
}