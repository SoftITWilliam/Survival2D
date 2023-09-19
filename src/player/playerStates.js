import { getPhysicsMultiplier } from "../helper/helper.js";
import { Player } from "./player.js";

export class PlayerState {
    constructor(stateName) {
        this.name = stateName;
    }

    enter() { }
    updateAnimation() { }
    updatePhysics(dt) { }
    handleInput(input) { }
}

export class PlayerStanding extends PlayerState {
    constructor() {
        super("STANDING");
    }
    
    enter(player) {
        this.player = player;
        const anim = this.player.animation;
        anim.currentFrame = 0;
        anim.frameCount = 2;
        anim.frameRate = 2;
        anim.loop = true;
    }

    updateAnimation() { 
        switch(this.player.facing) {
            case "right": this.player.frameY = 0; break;
            case "left": this.player.frameY = 1; break;
        }
    }

    handleInput(input) {
        if(input.keys.includes("W") || input.keys.includes(" ")) {
            this.player.setState(Player.States.JUMPING);
        }
        if(input.keys.includes("A") || input.keys.includes("D")) {
            this.player.setState(Player.States.RUNNING);
        }
        if(!this.player.grounded) {
            this.player.cheetahFrames = 3;
            this.player.setState(Player.States.FALLING);
        }
    }
}

export class PlayerRunning extends PlayerState {
    constructor() {
        super("RUNNING");
    }
    
    enter(player) {
        this.player = player;
        const anim = this.player.animation;
        anim.currentFrame = 3;
        anim.frameCount = 8;
        anim.frameRate = 15;
        anim.loop = true;
    }

    updateAnimation() { 
        switch(this.player.facing) {
            case "right": this.player.frameY = 2; break;
            case "left": this.player.frameY = 3; break;
        }
    }

    handleInput(input) {
        if(input.keys.includes("W") || input.keys.includes(" ")) {
            this.player.setState(Player.States.JUMPING);
        }

        if(!input.keys.includes("A") && !input.keys.includes("D")) {
            this.player.setState(Player.States.STANDING);
        }

        if(!this.player.grounded) {
            this.player.cheetahFrames = 3;
            this.player.setState(Player.States.FALLING);
        }
    }
}

export class PlayerJumping extends PlayerState {
    constructor() {
        super("JUMPING");
        this.holdTimer = 0; // in ms
        this.maxJumpTime = 140; // in ms
    }
    
    enter(player) {
        this.player = player;
        this.player.dy = -6.5;
        this.player.cheetahFrames = 0;

        this.holdTimer = 0;

        const anim = this.player.animation;
        anim.currentFrame = 0;
        anim.frameCount = 3;
        anim.frameRate = 15;
        anim.loop = false;
    }

    updateAnimation() { 
        // Determine direction player is facing
        switch(this.player.facing) {
            case "right": this.player.frameY = 4; break;
            case "left": this.player.frameY = 5; break;
        }
    }

    updatePhysics(dt) { 
        let m = getPhysicsMultiplier(dt);

        // Do gravity
        this.player.dy += this.player.gravity * m;
            
        // Cannot exceed max falling speed
        if(this.player.dy > this.player.maxFallSpeed) {
            this.player.dy = this.player.maxFallSpeed;
        }
    }

    handleInput(input, dt) {

        if(this.holdTimer < this.maxJumpTime) {
            if(input.keys.includes("W") || input.keys.includes(" ")) {
                this.player.dy = -6.5;
                this.holdTimer += dt;
            }
            else {
                this.holdTimer = this.maxJumpTime;
                this.player.dy = -4;
            }
        }

        if(this.player.dy >= 0) {
            this.player.setState(Player.States.FALLING);
        }
    }
}

export class PlayerFalling extends PlayerState {
    constructor() {
        super("FALLING");
    }

    enter(player) {
        this.player = player;

        const anim = this.player.animation;
        anim.currentFrame = 2;
        anim.frameCount = 3;
        anim.frameRate = 15;
        anim.loop = false;
    }

    updateAnimation() { 
        // Determine direction player is facing
        switch(this.player.facing) {
            case "right": this.player.frameY = 4; break;
            case "left": this.player.frameY = 5; break;
        }
    }

    updatePhysics(dt) { 
        let m = getPhysicsMultiplier(dt);

        if(this.player.cheetahFrames > 0) {
            this.player.cheetahFrames -= 1;
        }

        // Do gravity
        this.player.dy += this.player.gravity * m;
            
        // Cannot exceed max falling speed
        if(this.player.dy > this.player.maxFallSpeed) {
            this.player.dy = this.player.maxFallSpeed;
        }
    }

    handleInput(input) {
        if((input.keys.includes("W") || input.keys.includes(" ")) && this.player.cheetahFrames > 0) {
            this.player.setState(Player.States.JUMPING);
        }

        if(this.player.grounded) {
            if(this.player.dx == 0) {
                this.player.setState(Player.States.STANDING);
            } else {
                this.player.setState(Player.States.RUNNING );
            }
        }
    }
}

export class PlayerSwimming extends PlayerState {
    constructor(player) {
        super("SWIMMING", player);
    }

    enter() {

    }

    handleInput(input) {

    }
}