
// FIXED IMPORTS:
import { limitCameraX } from "../misc/util.js";
import { TILE_SIZE } from "./global.js";

export class InputHandler {
    constructor() {
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
                //this.gridX = Math.floor((limitCameraX(game.player.cameraX) + this.x) / TILE_SIZE);
                //this.gridY = Math.floor((-player.cameraY - this.y) / TILE_SIZE) + 1;
                //this.mapX = limitCameraX(player.cameraX) + this.x;
                //this.mapY = -player.cameraY - this.y;
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
            if((key === "A" ||
                key === "D" ||
                key === "W" ||
                key === " " ||
                key === "E" ||
                key === "1" ||
                key === "2" ||
                key === "3" ||
                key === "4" ||
                key === "5" ||
                key === "6" ||
                key === "X" 
                ) && this.keys.indexOf(key) === -1) {
                    this.keys.push(key);
            }
        });

        window.addEventListener("keyup", event => {
            let key = event.key.toUpperCase();
            if(key === "A" ||
                key === "D" ||
                key === "W" ||
                key === " " ||
                key === "E" ||
                key === "1" ||
                key === "2" ||
                key === "3" ||
                key === "4" ||
                key === "5" ||
                key === "6" ||
                key === "X"
                ) {
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
        })
    }
}

/*

document.addEventListener("keydown",function(event) {
    switch(event.key.toUpperCase()) {

        // ============================
        //      Movement controls
        // ============================
        
        case "A":
            player.walkLeft = true;
            break;

        case "D":
            player.walkRight = true;
            break;
        
        case "W":
        case " ":
            player.jump = true;
            break;

        // ============================
        //      Other controls
        // ============================

        // Open inventory
        case "E":
            if(player.inventory.view) {
                player.inventory.close();
            } else {
                player.inventory.view = true;
            }
            break;

        // Switch hotbar slot
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
            player.miningEvent = null;
            player.selectItem(parseInt(event.key));
            break;

        // Spawn dev toolset
        case "X":
            player.inventory.addItem(ITEM_REGISTRY['dev_pickaxe'],1);
            player.inventory.addItem(ITEM_REGISTRY['dev_axe'],1);
            player.inventory.addItem(ITEM_REGISTRY['dev_hammer'],1);
            player.inventory.addItem(ITEM_REGISTRY['dev_shovel'],1);
            break;
    }
});

document.addEventListener("keyup",function(event) {
    switch(event.key.toUpperCase()) {
        case "A":
            player.walkLeft = false;
            break;

        case "D":
            player.walkRight = false;
            break;
        
        case "W":
        case " ":
            player.jump = false;
            break;
    }
});

*/

// Prevent right click menu from opening
canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }