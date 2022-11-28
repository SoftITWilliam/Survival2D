

class TileInstance {
    constructor(gridX,gridY,tile) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * TILE_SIZE;
        this.y = -gridY * TILE_SIZE;
        this.w = TILE_SIZE;
        this.h = TILE_SIZE;
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;

        this.tile = tile;
    }

    draw() {
        ctx.drawImage(
            this.tile.sprite,this.tile.sx,this.tile.sy,TILE_SIZE,TILE_SIZE,
            this.x,this.y,TILE_SIZE,TILE_SIZE
        );
    }
}