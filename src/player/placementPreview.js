import { ctx, TILE_SIZE } from "../game/const.js";
import { sprites } from "../loadAssets.js";
import { calculateDistance } from "../misc.js";
import { player } from "./player.js";

export default class PlacementPreview {
    constructor(sprite,offsetX,offsetY) {
        this.sx = offsetX;
        this.sy = offsetY;

        this.sprite = sprite;
        
        // If sprite is missing, use 'missing texture'
        if(!this.sprite) {
            this.sprite = sprites.misc["missing_texture"];
            this.missingTexture = true;
        } else {
            this.missingTexture = false;
        }

        this.aRange = [0.4,0.7];

        this.a = this.aRange[0];
        this.aFade = 0.02;
    }

    // Alpha (a) goes back and forth between the lower and higher points in this.aRange
    updateAlpha() {
        this.a += this.aFade;
        if((this.aFade > 0 && this.a >= this.aRange[1]) || 
            (this.aFade < 0 && this.a <= this.aRange[0])) {
                this.aFade *= -1;
        }
    }

    draw(gridX,gridY) {
        this.updateAlpha();

        // If out of placement range, 
        let pos = {
            centerX:gridX * TILE_SIZE + TILE_SIZE / 2,
            centerY:-gridY * TILE_SIZE + TILE_SIZE / 2
        }

        if(calculateDistance(player,pos) > player.reach) {
            ctx.globalAlpha = 0.05;
        } else {
            ctx.globalAlpha = this.a;
        }

        let x = gridX * TILE_SIZE;
        let y = -gridY * TILE_SIZE;
        ctx.drawImage(this.sprite,this.sx,this.sy,TILE_SIZE,TILE_SIZE,x,y,TILE_SIZE,TILE_SIZE);
        ctx.globalAlpha = 1;
    }
}

