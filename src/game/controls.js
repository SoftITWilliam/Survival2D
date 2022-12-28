
// FIXED IMPORTS:
import { player } from "../player/player.js";
import { limitCameraX } from "../misc/util.js";
import { ITEM_REGISTRY } from "../item/itemRegistry.js";
import { TILE_SIZE, WORLD_HEIGHT } from "./const.js";

export let mouse = {
    click:false,
    rightClick:false,
    x:0,
    y:0,
    mapX:0,
    mapY:0,
    gridX:0,
    gridY:0,

    updateGridPos: function() {
        this.gridX = Math.floor((limitCameraX(player.cameraX) + this.x) / TILE_SIZE);
        this.gridY = Math.floor((-player.cameraY - this.y) / TILE_SIZE) + 1;
        this.mapX = limitCameraX(player.cameraX) + this.x;
        this.mapY = -player.cameraY - this.y;
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

let mouseDown;

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

canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }

document.addEventListener('mousedown', function(event) {
    event.preventDefault();

    if(event.button == 0) {
        mouse.click = true;
    } else if(event.button == 2) {
        mouse.rightClick = true;
    }
    
});

document.addEventListener('mouseup', function(event) {
    mouse.click = false;
});

document.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.updateGridPos();
})