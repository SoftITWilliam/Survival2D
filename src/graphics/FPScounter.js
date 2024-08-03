import { Observable } from "../class/Observable.js";

export default class FPSCounter {
    #counter = 0;
    display = 0;
    displayUpdated = new Observable();

    constructor() {
        this.updateInterval = setInterval(() => {
            this.display = this.#counter;
            this.#counter = 0;
            this.displayUpdated.notify(this.display);
        }, 1000);
    }

    increment() {
        this.#counter += 1;
    }
}