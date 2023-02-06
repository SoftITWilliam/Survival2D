import { ctx } from "../../game/global.js";
import WallBase from "../base/wallBase.js";
import TileDrop from "../tileDrop.js";

export class Log extends WallBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("wall_log");
        this.transparent = true;
        this.requireTool = false;
        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 1.5;

        this.tileDrops = [
            new TileDrop(this, "wood", [1,3], 100, true, false),
        ]
    }

    // Override
    canBeMined(item) {
        if(item && item.toolType == "hammer") {
            return false;
        }
        return true;
    }

    breakTile() {
        
        // If

        let tileAbove = this.world.getWall(this.gridX,this.gridY+1);
        if(tileAbove && tileAbove.registryName == "wall_log") {
            tileAbove.breakTile();
        }

        // Remove tile
        this.world.clearWall(this.gridX,this.gridY);

        this.dropItems();
        this.world.updateNearbyTiles(this.gridX,this.gridY);
    }

    draw() {
        ctx.fillStyle = "rgb(200,130,110)";
        ctx.fillRect(this.x+4,this.y,this.w-8,this.h);
    }


}