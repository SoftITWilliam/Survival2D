

export const stateEnum = {
    STANDING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
}

// Super class
class State {
    constructor(stateName, player) {
        this.name = stateName;
        this.player = player;
    }
}

export class PlayerStanding extends State {
    constructor(player) {
        super("STANDING", player);
    }
    
    enter() {
        this.player.frameX = 0;
        this.player.frameAmount = 2;
        this.player.frameDelay = 30; // 2 FPS
        this.player.frameLoop = true;
    }

    update() {
        switch(this.player.facing) {
            case "right": this.player.frameY = 0; break;
            case "left": this.player.frameY = 1; break;
        }
    }

    handleInput(input) {
        if(input.keys.includes("W") || input.keys.includes(" ")) {
            this.player.setState("JUMPING");
        }
        if(input.keys.includes("A") || input.keys.includes("D")) {
            this.player.setState("RUNNING");
        }
        if(!this.player.grounded) {
            this.player.cheetahFrames = 3;
            this.player.setState("FALLING");
        }
    }
}

export class PlayerRunning extends State {
    constructor(player) {
        super("RUNNING", player);
    }
    
    enter() {
        this.player.frameX = 3;
        this.player.frameAmount = 8;
        this.player.frameDelay = 4; // 15 FPS
        this.player.frameLoop = true;
    }

    update() {
        switch(this.player.facing) {
            case "right": this.player.frameY = 2; break;
            case "left": this.player.frameY = 3; break;
        }
    }

    handleInput(input) {
        if(input.keys.includes("W") || input.keys.includes(" ")) {
            this.player.setState("JUMPING");
        }

        if(!input.keys.includes("A") && !input.keys.includes("D")) {
            this.player.setState("STANDING");
        }

        if(!this.player.grounded) {
            this.player.cheetahFrames = 3;
            this.player.setState("FALLING");
        }
    }
}

export class PlayerJumping extends State {
    constructor(player) {
        super("JUMPING", player);
    }
    
    enter() {
        this.player.dy = -6.5;
        this.player.frameX = 0;
        this.player.frameAmount = 3;
        this.player.frameDelay = 4;
        this.player.frameLoop = false;
        this.player.cheetahFrames = 0;
        this.jumpFrames = 1;
    }

    update() {

        // Determine direction player is facing
        switch(this.player.facing) {
            case "right": this.player.frameY = 4; break;
            case "left": this.player.frameY = 5; break;
        }

        // Do gravity
        this.player.dy += this.player.gravity;
            
        // Cannot exceed max falling speed
        if(this.player.dy > this.player.maxFallSpeed) {
            this.player.dy = this.player.maxFallSpeed;
        }
    }

    handleInput(input) {

        if((input.keys.includes("W") || input.keys.includes(" ")) && this.jumpFrames < 20) {
            this.player.dy = -6.5;
            this.jumpFrames++;
        } else {
            this.jumpFrames = 20;
        }

        if(this.player.dy > 0) {
            this.player.setState("FALLING");
        }
    }
}

export class PlayerFalling extends State {
    constructor(player) {
        super("FALLING", player);
    }
    
    enter() {
        this.player.frameX = 2;
        this.player.frameAmount = 3;;
        this.player.frameLoop = false;
    }

    update(input) {
        // Determine direction player is facing
        switch(this.player.facing) {
            case "right": this.player.frameY = 4; break;
            case "left": this.player.frameY = 5; break;
        }

        if(this.player.cheetahFrames > 0) {
            this.player.cheetahFrames -= 1;
        }

        // Do gravity
        this.player.dy += this.player.gravity;
            
        // Cannot exceed max falling speed
        if(this.player.dy > this.player.maxFallSpeed) {
            this.player.dy = this.player.maxFallSpeed;
        }
    }

    handleInput(input) {
        if((input.keys.includes("W") || input.keys.includes(" ")) && this.player.cheetahFrames > 0) {
            this.player.setState("JUMPING");
        }

        if(this.player.grounded) {
            if(this.player.dx == 0) {
                this.player.setState("STANDING");
            } else {
                this.player.setState("RUNNING");
            }
        }
    }
}

export class PlayerSwimming extends State {
    constructor(player) {
        super("SWIMMING", player);
    }

    enter() {

    }

    handleInput(input) {

    }
}