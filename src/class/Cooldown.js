import { validNumbers } from "../helper/helper.js";



export class Cooldown {
    #duration
    #startTime
    #timerActive
    constructor(duration) {
        this.#duration = null;
        this.#startTime;
        this.#timerActive = false;

        this.duration = duration;
    }

    /**
     * @param {number} value
     */
    set duration(value) {
        // I yearn for TypeScript
        if(validNumbers(value)) {
            this.#duration = value;
        }
    }

    get duration() {
        return this.#duration;
    }

    start() {
        if(this.duration == null) {
            throw new Error(`Invalid cooldown duration (${this.duration})`);
        }

        this.#startTime = new Date().getTime();
        this.#timerActive = true;

        setTimeout(() => {
            this.#timerActive = false;
        }, this.#duration);
    }

    /**
     * @returns {number} Cooldown progress (in %)
     */
    getProgress() {
        if(this.isFinished()) return 100;

        const currentTime = new Date().getTime();

        let progressMs = currentTime - this.#startTime;
        let progressPercent = (progressMs / this.#duration) * 100;

        return progressPercent.toFixed(0);
    }

    isFinished() {
        return !this.#timerActive;
    }
}