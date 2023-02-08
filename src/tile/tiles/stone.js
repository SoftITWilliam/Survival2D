import { sprites } from "../../game/graphics/loadAssets.js";
import TileBase from "../base/tileBase.js";
import { TileDrop } from "../tileDrop.js";

export class Stone extends TileBase {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_stone");
        this.setSprite(sprites.tiles.tile_stone);

        this.toolType = "pickaxe";
        this.miningLevel = 1;
        this.miningTime = 3.0;

        this.tileDrops = [
            new TileDrop(this, "stone", 1, 100, false, true),
        ]
    }

    draw() {
        this.drawSprite();
    }
}