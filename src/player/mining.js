import { ctx } from "../game/global.js";

export default class MiningAction {
    constructor(tile,item,game) {
        console.log("MINING");
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
        this.goal = this.tile.getMiningTime() * 60;
        if(tile.getToolType() == this.toolType) {
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
        if(this.tile.getType() == "wall") {
            var object = this.world.getWall(this.tile.getGridX(), this.tile.getGridY());
        } else {
            var object = this.world.getTile(this.tile.getGridX(), this.tile.getGridY());
        }
        object.breakTile(this.tile, this.toolType, this.miningLevel);

        this.finished = true;
    }

    drawProgress() {
        let p = 1.5 + this.progress / this.goal * 2;

        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.moveTo(this.tile.getCenterX(),this.tile.getCenterY());
        ctx.lineTo(this.tile.getCenterX(),this.tile.getCenterY()-16);
        ctx.arc(this.tile.getCenterX(),this.tile.getCenterY(),16,1.5*Math.PI,p * Math.PI);
        ctx.lineTo(this.tile.getCenterX(),this.tile.getCenterY());
        ctx.fill();
    }
}