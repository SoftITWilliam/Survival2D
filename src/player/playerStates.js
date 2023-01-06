

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

    }

    handleInput(input) {
        if(input.keys.includes("W") || input.keys.includes(" ")) {
            this.player.setState("JUMPING");
        }
        if(input.keys.includes("A")) {
            this.player.setState("RUNNING");
            this.player.facing == "left";
        }
        if(input.keys.includes("D")) {
            this.player.setState("RUNNING");
            this.player.facing == "right";
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
        this.player.jumpFrames = 1;
    }

    handleInput(input) {
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