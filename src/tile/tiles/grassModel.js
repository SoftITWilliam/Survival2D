import { sprites } from "../../graphics/assets.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { rng } from "../../helper/helper.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import { Tile } from "../Tile.js";
import { TileRegistry } from "../tileRegistry.js";
import Item from "../../item/item.js";
import { Tileset } from "../Tileset.js";

export class GrassModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.type = Tile.types.SOLID;
        this.tilesetTemplate = Tileset.templates.NO_TILE_ABOVE;

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
                world.tiles.get(x, y).updateSpritePosition();
            }
        }
    }

    tileUpdate(tile, world) {
        // If another tile is placed on top of a grass tile, it is converted into a dirt block
        let tileAbove = world.tiles.get(tile.gridX, tile.gridY + 1);
        if(tileAbove && !tileAbove.transparent) {
            world.setTile(tile.gridX, tile.gridY, TileRegistry.DIRT);
            world.tiles.get(tile.gridX, tile.gridY).updateSpritePosition();
        }
    }
}