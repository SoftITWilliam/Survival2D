import { TextComponent } from './TextComponent.js';

export class OutlinedText extends TextComponent {
    constructor(game, attributes) {
        super(game, attributes);

        this.setTextAttribute("lineWidth",5);
    }
}