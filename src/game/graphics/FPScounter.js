export default class FPSCounter {
    #counter;
    constructor() {
        this.#counter = 0;
        this.display = 0;
        
        this.updateInterval = setInterval(() => {
            this.display = this.#counter;
            this.#counter = 0;
        }, 1000);
    }

    increment() {
        this.#counter += 1;
    }
}