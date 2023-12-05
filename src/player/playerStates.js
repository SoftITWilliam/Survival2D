import { getPhysicsMultiplier } from "../helper/helper.js";
import { Facing, Player } from "./player.js";

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
    
    /** @param {Player} player */
    enter(player) {
        this.player = player;

        switch(this.player.facing) {
            case Facing.RIGHT: this.player.animations.play('IDLE_RIGHT'); break;
            case Facing.LEFT: this.player.animations.play('IDLE_LEFT'); break;
        }
    }

    updateAnimation() { 
        const anim = this.player.animations;

        switch(this.player.facing) {
            case Facing.RIGHT: 
                if(anim.get('IDLE_LEFT').isActive()) 
                    anim.get('IDLE_LEFT').transitionTo(anim.get('IDLE_RIGHT'));
                break;
            case Facing.LEFT: 
                if(anim.get('IDLE_RIGHT').isActive()) 
                    anim.get('IDLE_RIGHT').transitionTo(anim.get('IDLE_LEFT'));
                break;
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
    
    /** @param {Player} player */
    enter(player) {
        /** @type {Player} */
        this.player = player;

        switch(this.player.facing) {
            case Facing.RIGHT: this.player.animations.play('WALK_RIGHT'); break;
            case Facing.LEFT: this.player.animations.play('WALK_LEFT'); break;
        }
    }

    updateAnimation() { 
        const anim = this.player.animations;

        switch(this.player.facing) {
            case Facing.RIGHT: 
                if(anim.get('WALK_LEFT').isActive()) 
                    anim.get('WALK_LEFT').transitionTo(anim.get('WALK_RIGHT'));
                break;
            case Facing.LEFT: 
                if(anim.get('WALK_RIGHT').isActive()) 
                    anim.get('WALK_RIGHT').transitionTo(anim.get('WALK_LEFT')); 
                break;
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

        switch(this.player.facing) {
            case Facing.RIGHT: this.player.animations.play('JUMP_RIGHT'); break;
            case Facing.LEFT: this.player.animations.play('JUMP_LEFT'); break;
        }
    }

    updateAnimation() { 
        const anim = this.player.animations;

        switch(this.player.facing) {
            case Facing.RIGHT: 
                if(anim.get('JUMP_LEFT').isActive()) 
                    anim.get('JUMP_LEFT').transitionTo(anim.get('JUMP_RIGHT'));
                break;
            case Facing.LEFT: 
                if(anim.get('JUMP_RIGHT').isActive()) 
                    anim.get('JUMP_RIGHT').transitionTo(anim.get('JUMP_LEFT')); 
                break;
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

        this.player.animations.getActive()?.stop();
        this.updateAnimation();
    }

    updateAnimation() { 
        const lastFrameIndex = this.player.animations.get('JUMP_LEFT').frames.length - 1;
        
        switch(this.player.facing) {
            case Facing.RIGHT: this.player.animations.playFrom('JUMP_RIGHT', lastFrameIndex); break;
            case Facing.LEFT: this.player.animations.playFrom('JUMP_LEFT', lastFrameIndex); break;
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