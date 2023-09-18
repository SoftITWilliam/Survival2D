import { validNumbers } from "../helper/helper.js";

export class Cooldown {

    // private fields
    #duration
    #startTime
    #timerActive

    /**
     * Represents a cooldown for performing an action.
     * Set cooldown duration through constructor or with the duration setter
     * Begin the cooldown by doing .start()
     * Check cooldown progress using any of the getProgress methods
     * Check if the cooldown is finished using .isFinished(), alternatively set a callback when starting the cooldown.
     * @param {number} duration Cooldown duration (ms)
     */
    constructor(duration) {
        this.#startTime;
        this.#timerActive = false;
        this.duration = duration;
    }

    /**
     * Note: Setting duration does not *start* the cooldown! Use .start() for that
     * @param {number} value
     */
    set duration(value) {
        // I yearn for TypeScript
        if(validNumbers(value)) {
            this.#duration = value;
        }
    }

    /**
     * @returns {number}
     */
    get duration() {
        return this.#duration;
    }

    /**
     * @param {(Function | null)} onFinishedCallback Is called once the cooldown is over
     */
    start(onFinishedCallback = null) {
        if(this.duration == null) {
            throw new Error(`Invalid cooldown duration (${this.duration})`);
        }

        this.#startTime = new Date().getTime();
        this.#timerActive = true;

        setTimeout(() => {
            this.#timerActive = false;
            if(typeof onFinishedCallback == "function") {
                onFinishedCallback();
            }
        }, this.#duration);
    }

    /**
     * @returns {boolean} True if cooldown isn't currently active
     */
    isFinished() {
        return !this.#timerActive;
    }

    /**
     * @returns {number} Milliseconds passed since cooldown started
     */
    getProgressMs() {
        return new Date().getTime() - this.#startTime;
    }

    /**
     * @returns {number} Cooldown progress (in %)
     */
    getProgressPercent() {
        if(this.isFinished()) return 100;
        else return (this.getProgressDecimal() * 100).toFixed(0);
    }

    /**
     * @returns {number} Cooldown progress in decimal (0-1)
     */
    getProgressDecimal() {
        if(this.isFinished()) return 1;
        else return (this.getProgressMs() / this.#duration)
    }
}