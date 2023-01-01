

export default class FPSCounter {
    constructor(game) {
        this.game = game; // Pointer
        this.counter = 0;
        this.display = 0;
        let updateInterval = setInterval(this.updateDisplay.bind(this),1000);
    }

    increment() {
        this.counter += 1;
    }

    updateDisplay() {
        this.display = this.counter;
        this.counter = 0;
    }
}



