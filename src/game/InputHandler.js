import { Observable } from "../class/Observable.js";
import { TILE_SIZE } from "./global.js";

export class InputHandler {
    keys = [];
    scroll = 0;

    /** Notifies when any key is pressed. data: { key } */
    keyDown = new Observable();
    /** Notifies when any key is released. data: { key } */
    keyUp = new Observable();
    /** Notifies on user left click. No data */
    leftClick = new Observable();
    /** Notifies on user right click. No data */
    rightClick = new Observable();

    constructor(game) {
        this.game = game;
        this.mouse = {
            click: false,
            rightClick: false,
            x: 0,
            y: 0,
            mapX: 0,
            mapY: 0,
            gridX: 0,
            gridY: 0,

            updateGridPos: function() {
                this.mapX = game.player.camera.x + this.x;
                this.mapY = -game.player.camera.y - this.y;
                this.gridX = Math.floor(this.mapX / TILE_SIZE);
                this.gridY = Math.floor(this.mapY / TILE_SIZE) + 1;
            },
        
            on: function(obj) {
                return (
                    this.mapX > obj.x && 
                    this.mapX < obj.x2 &&
                    -this.mapY > obj.y && 
                    -this.mapY < obj.y2
                );
            },
        
            onUI: function(obj) {
                return (
                    this.x > obj.x && 
                    this.x < obj.x2 &&
                    this.y > obj.y && 
                    this.y < obj.y2
                );
            }
        }

        window.addEventListener('keydown', event => {
            const key = event.key.toUpperCase();
            if(this.keys.indexOf(key) === -1) {
                this.keyDown.notify({ key });
                this.keys.push(key);
            }
        });

        window.addEventListener('keyup', event => {
            const key = event.key.toUpperCase();
            if(this.keys.includes(key)) {
                this.keyUp.notify({ key });
                this.keys.splice(this.keys.indexOf(key), 1);
            }
        });

        document.addEventListener('mousedown', event => {
            event.preventDefault();
            if(event.button == 0) {
                this.leftClick.notify();
                this.mouse.click = true;
            } else if(event.button == 2) {
                this.rightClick.notify();
                this.mouse.rightClick = true;
            }
        });
        
        document.addEventListener('mouseup', event => {
            if(event.button == 0) this.mouse.click = false;
            else if(event.button == 2) this.mouse.rightClick = false;
        });
        
        document.addEventListener('mousemove', event => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;
            this.mouse.updateGridPos();
        });

        document.addEventListener('wheel', event => {
            this.scroll = event.deltaY;
        });
    }

    removeKey(key) {
        this.keys.splice(this.keys.indexOf(key), 1);
    }
}

// Prevent right click menu from opening
canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }