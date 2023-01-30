import { sprites } from "../../game/graphics/loadAssets.js";
import { rng } from "../../misc/util.js";
import { Tile } from "../../tile/tile.js";
import { Dirt } from "../../tile/tileParent.js";

export class Grass extends Tile {
    constructor(gridX,gridY,world) {
        super(gridX,gridY,world);
        this.setRegistryName("tile_grass");
        this.setSprite(sprites.tiles.tile_grass);

        this.objectType = "solid";
        this.toolType = "shovel";
        this.miningLevel = 0;
        this.miningTime = 1.5;

        this.tileDrops = [
            {id:0,rate:100,amount:1,requireTool:false},
            {id:9,rate:10,amount:1,requireTool:false}
        ]
    }

    draw() {
        this.drawSprite();
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
                this.world.getTile(x,y).getTilesetSource();
            }
        }
    }

    tileUpdate() {
        // If another tile is placed on top of a grass tile, it is converted into a dirt block
        if(this.world.getTile(this.gridX,this.gridY + 1)) {
            this.world.setTile(this.gridX,this.gridY,new Dirt(this.gridX,this.gridY,this.world));
            this.world.getTile(this.gridX,this.gridY).getTilesetSource();
        }
    }

    // Grass uses a different tileset from other tiles
    getTilesetSource() {
        let a = this.getAdjacent();

        let s = [];

        if(!a.ml && a.mr) {
            if(!a.bm) {s = [0,1]}
            else if(a.br) {s = [0,0]}
            else if(!a.br) {s = [0,2]}
        }

        if(a.ml && a.mr) {
            if(!a.bm) {s = [1,1]}
            else if(a.bl && a.br) {s = [1,0]}
            else if(!a.bl && a.br) {s = [1,2]}
            else if(!a.bl && !a.br) {s = [2,2]}
            else if(a.bl && !a.br) {s = [3,2]}
        }

        if(a.ml && !a.mr) {
            if(!a.bm) {s = [2,1]}
            else if(a.bl) {s = [2,0]}
            else if(!a.bl) {s = [4,2]}
        }

        if(!a.ml && !a.mr) {
            if(!a.bm) {s = [3,1]}
            else {s = [3,0]}
        }

        if(this.missingTexture) {
            this.sx = 0;
            this.sy = 0;
        } else {
            this.sx = 12 + (s[0] * 60);
            this.sy = 12 + (s[1] * 60);
        }
    }
}