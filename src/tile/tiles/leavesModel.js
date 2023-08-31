import { ctx, TILE_SIZE } from "../../game/global.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import toolTypes from "../../item/toolTypesEnum.js";
import { ItemRegistry } from "../../item/itemRegistry.js";

export class LeavesModel extends TileBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.transparent = true;
        this.setMiningProperties(toolTypes.AXE, 0, 0.6, false);

        this.tileDrops = [
            new TileDrop(ItemRegistry.BRANCH, 1, 2).chance(25).affectedByMultipliers(),
            new TileDrop(ItemRegistry.ACORN).chance(15).affectedByMultipliers(),
        ]
    }

    render(x,y) {
        ctx.fillStyle = "rgba(60,150,40,0.8)";
        ctx.fillRect(x, y, this.w, this.h);
    }
}