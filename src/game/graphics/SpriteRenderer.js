


export class SpriteRenderer {
    #sx;
    #sy;
    constructor(source = null) {
        if(source instanceof Image) {
            this.source = source;
        }

        this._sx = 0;
        this._sy = 0;

        this.sheetX = 0;
        this.sheetY = 0;

        this.height = 0;
        this.width = 0;
    }

    get sx() {
        return this.#sx || (this.sheetX * this.width);
    }

    get sy() {
        return this.#sy || (this.sheetY * this.height);
    }

    setSource(source) {
        if(source instanceof Image) {
            this.source = source;
        } else {
            console.warn("SpriteRenderer.setSource(): 'source' is not a valid image");
        }
        return this;
    }

    setSourcePosition(sx, sy) {
        this.#sx = sx;
        this.#sy = sy;
        return this;
    }

    setSheetPosition(sheetX, sheetY) {
        this.sheetX = sheetX;
        this.sheetY = sheetY;
        return this;
    }
    
    setSpriteSize(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    draw(ctx, x, y) {
        ctx.drawImage(this.source, 
            this.sx, this.sy, 
            this.width, this.height,
            x, y,
            this.width, this.height,
        );
    }

    drawCentered(ctx, x, y) {
        this.draw(ctx, x - (this.width / 2), y - (this.height / 2));
    }

    drawFromObject(ctx, obj) {

        let widthDiff = this.width - obj.width;
        let heightDiff = this.height - obj.height;

        this.draw(ctx, obj.x - (widthDiff / 2), obj.y - (heightDiff / 2));
    }
}