import { ctx, TILE_SIZE } from "../../game/const.js";
import { sprites } from "../../loadAssets.js";
import { image } from "../../misc.js";
import { Tile } from "../../world/tile/tile.js";

export class Grass extends Tile {
    constructor(gridX,gridY) {
        super(gridX,gridY);
        this.setRegistryName("tile_grass");
        this.setSprite(sprites.tiles.tile_grass);

        this.objectType = "solid";
        this.toolType = "shovel";
        this.miningLevel = 0;
        this.miningTime = 1.5;

        this.tileDrops = [
            {id:1,rate:100,amount:1,requireTool:false}
        ]
    }

    draw() {
        this.drawSprite();
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