import { FrameAnimation } from "./FrameAnimation.js";

export class AnimationSet {
    #animations = {}
    /**
     * @param {object} animations
     */
    constructor(animations) {
        if(typeof animations != "object") {
            throw new TypeError('Expected an object');
        }
        if(Object.values(animations).every(anim => anim instanceof FrameAnimation) == false) {
            throw new TypeError('All object values must be of type FrameAnimation')
        }

        this.#animations = animations;
    }

    get(key) {
        if(this.#animations.hasOwnProperty(key)) {
            return this.#animations[key];
        }
        return null;
    }

    /**
     * @param {string} key
     * @param {FrameAnimation} animation 
     */
    add(key, animation) {
        if(typeof key != "string" || animation instanceof FrameAnimation === false) {
            throw new TypeError('add(): Invalid key or animation type');
        }
        if(this.#animations.hasOwnProperty(key)) {
            throw new Error(`add(): Animation with key '${key}' already exists`);
        }
        this.#animations[key] = animation;
    }

    /**
     * @param {string|FrameAnimation} animation 
     */
    play(animation) {
        this.getActive()?.stop();

        if(typeof animation == "string") {
            animation = this.get(animation);
        }
        if(animation instanceof FrameAnimation) {
            animation.play();
        }
        else throw new Error('play(): Animation not found');
    }

    /**
     * Start playing animation from a specific frame index
     * @param {string|FrameAnimation} animation 
     * @param {number} frame Frame index (0 <= n < frames.length)
     * @param {number} [elapsedTime]
     */
    playFrom(animation, frame, elapsedTime = 0) {
        this.getActive()?.stop();

        if(typeof animation == "string") {
            animation = this.get(animation);
        }
        if(animation instanceof FrameAnimation) {
            animation.playFrom(frame, elapsedTime);
        }
        else throw new Error('playFrom(): Animation not found')
    }

    /**
     * @returns {FrameAnimation|null}
     */
    getActive() {
        return Object.values(this.#animations).find(anim => anim.isActive()) ?? null;
    }

    *[Symbol.iterator]() {
        for(const key in this.#animations) {
            yield key;
        }
    }
}