import { validNumbers } from "../helper/helper.js";
import { Spritesheet } from "./Spritesheet.js";

export class FrameAnimation {
    #time = 0;
    #currentFrameIndex = 0;
    #active = false;
    #paused = false;

    /**
     * @param {object} params
     * @param {Spritesheet} params.spritesheet
     * @param {number} fps
     * @param {boolean} loop Whether or not the animation should loop
     * @param {{x: number, y: number}[]} frames Array of spritesheet positions
     */
    constructor({ spritesheet, fps, loop, frames }) {
        this.spritesheet = spritesheet;
        this.fps = fps ?? 5;
        this.loop = loop ?? false;
        this.frames = frames ?? [];
    }

    get frameDelayMs() {
        if(this.fps == 0) return null;
        return (1000 / this.fps);
    }

    get fullCycleTime() {
        return (this.frameDelay * this.frameCount);
    }

    isActive() {
        return this.#active;
    }

    /**
     * Start playing animation from beginning
     */
    play() {
        this.#currentFrameIndex = 0;
        this.#active = true;
        this.#paused = false;
    }

    /**
     * Start playing animation from a speccific frame index
     * @param {number} frame Frame index (0 <= n < frames.length)
     * @param {number} [elapsedTime]
     */
    playFrom(frame, elapsedTime = 0) {
        if(!validNumbers(frame)) throw new TypeError();
        if(frame < 0 || frame >= this.frames.length) throw new RangeError(`Frame ${frame} is out of range! 0 >= frame < ${this.frames.length}`);

        this.#currentFrameIndex = frame;
        this.#active = true;
        this.#time = elapsedTime ?? 0;
        this.#paused = false;

        if(this.loop === true && frame >= this.frames.length - 1) {
            this.#paused = true;
        }
    }

    stop() {
        this.#time = 0;
        this.#active = false;
    }

    pause() { this.#paused = true; }

    unpause() { this.#paused = false; }

    getCurrentFrame() {
        return this.#currentFrameIndex;
    }

    /**
     * @returns {{ x: number, y: number }}
     */
    getCurrentFramePosition() {
        return this.frames[this.#currentFrameIndex] ?? {x:0, y:0};
    }

    update(dt) {
        if(!this.#active || this.fps == 0 || this.#paused) return;
        

        this.#time += dt;

        // Increment frame if enough time has passed
        if(this.#time > this.frameDelayMs) {
            this.#currentFrameIndex += 1;
            this.#time = this.#time % this.frameDelayMs;

            if(this.#currentFrameIndex >= this.frames.length) {
                this.#finish();
            }
        }
    }

    /**
     * Transtition from this animation to another animation,
     * while maintaining frame index and elapsed time.
     * Should only be used if both animations have the same amount of frames.
     * Useful for switching between animations that face left or right, for example.
     * @param {FrameAnimation} newAnimation 
     */
    transitionTo(newAnimation) {
        if(newAnimation instanceof FrameAnimation === false) throw new TypeError();
        newAnimation.playFrom(this.#currentFrameIndex, this.#time);
        this.stop();
    }

    #finish() {
        if(this.loop === true) {
            this.#currentFrameIndex = 0;
        } else {
            this.#currentFrameIndex = this.frames.length - 1;
            this.pause();
        }
    }
}