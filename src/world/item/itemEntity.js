import { overlap, surfaceCollision } from "../../game/collision.js";
import { ctx, GRAVITY, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../../game/const.js";
import { player } from "../../player/player.js";
import { gridXfromCoordinate, gridYfromCoordinate, mouseOn, setAttributes } from "../../misc.js";
import { getTile } from "../tile/tile.js";
import { mouse } from "../../game/controls.js";
import { sprites } from "../../loadAssets.js";

export let itemEntities = [];

export class ItemEntity {
    constructor(x,y,dx,dy,stackSize,item) {
        this.item = item;
        this.w = this.h = this.item.entitySize;
        this.dx = dx;
        this.dy = dy;
        this.stackSize = stackSize;
        this.setInitialPosition(x,y);
    }

    setInitialPosition(x,y) {
        this.x = x - this.w / 2;
        this.y = y - this.w / 2;
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.y / 2;
    }

    update() {
        this.inLiquid = false;
        this.grounded = false;

        this.dy += GRAVITY * 0.6;

        this.gridX = gridXfromCoordinate(this.x);
        this.gridY = gridYfromCoordinate(this.y);
        this.checkCollision();

        this.updatePosition();

        if(this.dx) {
            this.dx *= 0.9;
        }
    }

    bounce() {
        if(this.dy < 1) {
            this.grounded = true;
            this.dy = 0;
            this.dx = 0;
        }
        this.dy = -this.dy * 0.5;
    }

    checkCollision() {
        for(let x=this.gridX - 2;x<this.gridX + 2;x++) {
            for(let y=this.gridY - 2;y<this.gridY + 2;y++) {
                if(x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) {
                    continue;
                }

                let tile = getTile(x,y);
                if(!tile) {
                    continue;
                }

                if(tile.objectType == "solid") {
                    if(surfaceCollision("top",this,tile)) {
                        this.y = tile.y - this.h;
                        this.bounce();
                    }

                    if(surfaceCollision("bottom",this,tile)) {
                        this.dy = 0;
                        this.y = tile.y + tile.h;
                    }

                    if(surfaceCollision("left",this,tile)) {
                        this.dx = 0;
                        this.x = tile.x - this.w;
                    }

                    if(surfaceCollision("right",this,tile)) {
                        this.dx = 0;
                        this.x = tile.x + tile.w;
                    }
                }
            }
        }
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        if(!this.item.missingTexture) {
            ctx.drawImage(
                this.item.sprite,this.item.sx,this.item.sy,TILE_SIZE,TILE_SIZE,
                this.x,this.y,this.w,this.h);
        } else {
            ctx.drawImage(
                sprites.misc.missing_texture,0,0,TILE_SIZE,TILE_SIZE,
                this.x,this.y,this.w,this.h);
        }

        if(mouseOn(this,mouse)) {
            this.drawLabel();
        }
    }

    drawLabel() {
        setAttributes(ctx,{font:"20px Font1",fillStyle:"rgba(0,0,0,0.5)",textAlign:"left"});
        let offset = 20;
        let txt = this.item.displayName + " ("+this.stackSize+")";
        let boxWidth = ctx.measureText(txt).width + offset * 2;
        ctx.fillRect(mouse.mapX,-mouse.mapY - 28,boxWidth,28);
        ctx.fillStyle = "white";
        ctx.fillText(txt,mouse.mapX + offset,-mouse.mapY - 6);
    }

    pickUp() {
        let remaining = player.inventory.addItem(this.item,this.stackSize);

        // If inventory is full, set stack size to remaining amount
        if(remaining > 0) {
            this.stackSize = remaining;
            return 0;
        } 
        
        // If player has picked up the item, remove the entity.
        else {
            return 1;
        }
        
    }
}

export function updateItemEntities() {
    for(let i=0;i<itemEntities.length;i++) {
        itemEntities[i].update();

        if(overlap(itemEntities[i],player)) {
            let removed = itemEntities[i].pickUp();
            if(removed) {
                itemEntities.splice(i,1);
                break;
            }
        }
    }
}

