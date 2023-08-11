

export class FrameAnimation {
    constructor() {
        this.currentFrame = 0;
        this.frameCount = 0;
        this.frameRate = 1; // in FPS
        this.loop = true;

        this.time = 0;
    }

    get frameDelay() { // delay between each frame, in seconds
        return (1000 / this.frameRate);
    }

    get fullCycleTime() { // time it takes to complete one animation cycle
        return (this.frameDelay * this.frameCount);
    }

    get active() {
        if(!this.loop && this.currentFrame >= this.frameCount - 1) return false;
        return true;
    }

    update(dt) {
        console.log(dt, this.frameDelay);
        if(!this.active) return;

        this.time += dt;

        // Increment frame if enough time has passed
        // TODO increment multiple frames at once if dt is large enough
        if(this.time > this.frameDelay) {
            this.currentFrame += 1;
            this.time = this.time % this.frameDelay;

            if(this.currentFrame >= this.frameCount && this.loop) {
                this.currentFrame = 0;
            }
        }
    }
}