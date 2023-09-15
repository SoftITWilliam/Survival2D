import { sprites } from "../../game/graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { rng } from "../../helper/helper.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import { Tile } from "../Tile.js";
import { TileRegistry } from "../tileRegistry.js";
import Item from "../../item/item.js";

export class GrassModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.type = Tile.types.SOLID;
        this.setSprite(sprites.tiles.tile_grass);
        this.setMiningProperties(Item.toolTypes.SHOVEL, 0, 1.5, false);

        this.tileDrops = [
            new TileDrop(Items.DIRT),
            new TileDrop(Items.GRASS_SEEDS).chance(10).affectedByMultipliers(),
        ]
    }

    static canSpreadTo(x, y, world) {
        let tileIsDirt = (Tile.isTile(world.tiles.get(x, y), TileRegistry.DIRT));
        let noTileAbove = (world.tiles.get(x, y + 1) == null);
        return (tileIsDirt && noTileAbove);
    }

    tickUpdate(tile, world) {
        // Try to spread grass to surrounding tiles
        let range = 2;
        for(let x = tile.gridX - range; x <= tile.gridX + range; x++) {
            for(let y = tile.gridY - range; y <= tile.gridY + range; y++) {
                if(!GrassModel.canSpreadTo(x, y, world)) continue;
                if(rng(0, 1023) > 0) continue;
                
                world.setTile(x, y, TileRegistry.GRASS);
                world.tiles.get(x, y).getSpritePosition();
            }
        }
    }

    tileUpdate(tile, world) {
        // If another tile is placed on top of a grass tile, it is converted into a dirt block
        let tileAbove = world.tiles.get(tile.gridX, tile.gridY + 1);
        if(tileAbove && !tileAbove.transparent) {
            world.setTile(tile.gridX, tile.gridY, TileRegistry.DIRT);
            world.tiles.get(tile.gridX, tile.gridY).getSpritePosition();
        }
    }

    // Grass uses a different tileset from other tiles
    getSpritePosition(a) {
        if(!a.ml && a.mr) {
            return !a.bm ? {x:0, y:1} : a.br ? {x:0, y:0} : {x:0, y:2}
        }

        if(a.ml && a.mr) {
            if(!a.bm) {return {x:1, y:1}}
            else if(a.bl && a.br) {return {x:1, y:0}}
            else if(!a.bl && a.br) {return {x:1, y:2}}
            else if(!a.bl && !a.br) {return {x:2, y:2}}
            else if(a.bl && !a.br) {return {x:3, y:2}}
        }

        if(a.ml && !a.mr) {
            if(!a.bm) {return {x:2, y:1}}
            else if(a.bl) {return {x:2, y:0}}
            else if(!a.bl) {return {x:4, y:2}}
        }

        if(!a.ml && !a.mr) {
            return !a.bm ? {x:3, y:1} : {x:3, y:0}
        }
    }
}