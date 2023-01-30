import { sprites } from "../../game/graphics/loadAssets.js";
import { Tile } from "../../tile/tile.js";

export class Sapling extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("placeable_sapling");
        this.setSprite(sprites.placeables.sapling);
        this.objectType = "nonSolid";
        this.toolType = "axe";
        this.miningLevel = 0;
        this.miningTime = 0.2;

        this.connective = false;
        this.transparent = true;
        
        this.tileDrops = [
            {id:8,rate:50,amount:1,requireTool:false}
        ];
    }

    draw() {
        this.drawSprite();
    }
}