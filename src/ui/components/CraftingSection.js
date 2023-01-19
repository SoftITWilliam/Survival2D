import { colors } from "../../game/graphics/colors.js";
import UIComponent from "./UIComponent.js";


export class CraftingSection extends UIComponent {
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