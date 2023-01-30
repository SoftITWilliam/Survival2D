import { sprites } from "../../game/graphics/loadAssets.js";
import PlaceableBase from "../base/placeableBase.js";

export class Sapling extends PlaceableBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("placeable_sapling");
        this.setSprite(sprites.placeables.sapling);
        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 0.2;
        this.requireTool = true;
        
        this.tileDrops = [
            {id:8,rate:50,amount:1,requireTool:false}
        ];
    }

    tileUpdate() {
        if(!this.world.getTile(this.gridX, this.gridY - 1)) {
            this.breakTile();
        }
    }

    draw() {
        this.drawSprite();
    }
}