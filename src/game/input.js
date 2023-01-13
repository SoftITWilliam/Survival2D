
// FIXED IMPORTS:
import { TILE_SIZE } from "./global.js";

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.mouse = {
            click:false,
            rightClick:false,
            x:0,
            y:0,
            mapX:0,
            mapY:0,
            gridX:0,
            gridY:0,

            updateGridPos: function() {
                this.gridX = Math.floor((game.player.camera.getX() + this.x) / TILE_SIZE);
                this.gridY = Math.floor((-game.player.camera.getY() - this.y) / TILE_SIZE) + 1;
                this.mapX = game.player.camera.getX() + this.x;
                this.mapY = -game.player.camera.getY() - this.y;
            },
        
            on: function(obj) {
                if(this.mapX > obj.x && this.mapX < obj.x + obj.w &&
                    -this.mapY > obj.y && -this.mapY < obj.y + obj.h) {
                        return true;
                } 
                return false;
            },
        
            onUI: function(obj) {
                if(this.x > obj.x && this.x < obj.x + obj.w &&
                    this.y > obj.y && this.y < obj.y + obj.h) {
                        return true;
                } 
                return false;
            }
        }

        this.keys = [];

        window.addEventListener("keydown", event => {
            let key = event.key.toUpperCase();
            if(this.keys.indexOf(key) === -1) {
                this.keys.push(key);
            }
        });

        window.addEventListener("keyup", event => {
            let key = event.key.toUpperCase();
            if(this.keys.includes(key)) {
                this.keys.splice(this.keys.indexOf(key),1);
            }
        });

        document.addEventListener('mousedown', event => {
            event.preventDefault();
        
            if(event.button == 0) {
                this.mouse.click = true;
            } else if(event.button == 2) {
                this.mouse.rightClick = true;
            }
            
        });
        
        document.addEventListener('mouseup', event => {
            this.mouse.click = false;
        });
        
        document.addEventListener('mousemove', event => {
            let rect = canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;
            this.mouse.updateGridPos();
        });
    }

    removeKey(key) {
        this.keys.splice(this.keys.indexOf(key),1);
    }
}

// Prevent right click menu from opening
canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }