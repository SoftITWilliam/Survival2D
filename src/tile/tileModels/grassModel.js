import { TILE_SIZE } from "../../game/global.js";
import { sprites } from "../../game/graphics/loadAssets.js";
import { rng } from "../../misc/util.js";
import { Dirt } from "../../tile/tileParent.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "./TileBase.js";

export class GrassModel extends TileBase {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setSprite(sprites.tiles.tile_grass);
        this.setMiningProperties("shovel", 0, 1.5, false);
        this.setType("solid");

        this.tileDrops = [
            new TileDrop(this, "dirt", 1, 100, false, false),
            new TileDrop(this, "grass_seeds", 1, 10, true, false),
        ]
    }

    checkSpreadCondition(x,y) {
        let tile = this.world.getTile(x,y);
        if(tile && tile.registryName == "tile_dirt") {
            y += 1;
            if(!this.world.getTile(x,y)) {
                return true;
            }
        }
        return false;
    }

    tickUpdate() {
        // Try to spread grass to surrounding tiles
        let range = 2;
        for(let x = this.gridX - range; x <= this.gridX + range; x++) {
            for(let y = this.gridY - range; y <= this.gridY + range; y++) {
                if(!this.checkSpreadCondition(x,y)) {
                    continue;
                };
                if(rng(0,1023) > 0) {
                    continue;
                }
                this.world.setTile(x,y,new Grass(x, y, this.world));
                this.world.getTile(x,y).getSpritePosition();
            }
        }
    }

    tileUpdate() {
        // If another tile is placed on top of a grass tile, it is converted into a dirt block
        let tileAbove = this.world.getTile(this.gridX,this.gridY + 1);
        if(tileAbove && !tileAbove.transparent) {
            this.world.setTile(this.gridX,this.gridY,new Dirt(this.gridX,this.gridY,this.world));
            this.world.getTile(this.gridX,this.gridY).getSpritePosition();
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