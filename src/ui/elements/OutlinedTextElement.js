import { TextElement } from './TextElement.js';

export class OutlinedTextElement extends TextElement {
    constructor(game, attributes) {
        super(game, attributes);

        this.setTextAttribute("lineWidth",5);
    }
}