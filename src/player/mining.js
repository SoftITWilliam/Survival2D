import { ctx } from "../game/global.js";

export default class MiningAction {
    constructor(tile,item,game) {
        this.world = game.world;
        this.tile = tile;
        this.finished = false;

        if(item) {
            this.toolType = item.toolType ? item.toolType : null;
            this.miningSpeed = item.miningSpeed ? item.miningSpeed : 1;
            this.miningLevel = item.miningLevel ? item.miningLevel : 0;
        } else {
            this.toolType = null;
            this.miningSpeed = 1;
            this.miningLevel = 0;
        }
        
        this.progress = 0;

        // Calculate total mining time
        this.goal = this.tile.miningTime * 60;
        if(tile.toolType == this.toolType) {
            this.goal = Math.floor(this.goal / this.miningSpeed);
        }
    }

    increaseProgress() {
        this.progress += 1;
        if(this.progress == this.goal) {
            this.finish();
        }
    }

    finish() {

        // Break tile
        if(this.tile.objectType == "wall") {
            var object = this.world.getWall(this.tile.gridX,this.tile.gridY);
        } else {
            var object = this.world.getTile(this.tile.gridX,this.tile.gridY);
        }
        object.breakTile(this.toolType,this.miningLevel);

        this.finished = true;
    }

    drawProgress() {
        let p = 1.5 + this.progress / this.goal * 2;

        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.moveTo(this.tile.centerX,this.tile.centerY);
        ctx.lineTo(this.tile.centerX,this.tile.centerY-16);
        ctx.arc(this.tile.centerX,this.tile.centerY,16,1.5*Math.PI,p * Math.PI);
        ctx.lineTo(this.tile.centerX,this.tile.centerY);
        ctx.fill();
    }
}