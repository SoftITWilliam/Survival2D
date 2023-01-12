import { ctx } from "../game/global.js";
import { colors } from "../game/graphics/colors.js";
import { rgb } from "../game/graphics/rgb.js";
import { setAttributes, drawRounded } from "../misc/util.js";



export default class CraftingInterface {
    constructor(menu) {
        this.menu = menu;
        this.x;
        this.y;
        this.w;
        this.h;
    }

    setProperties(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    renderBase() {
        setAttributes(ctx,{
            fillStyle:rgb(colors.uiLight),
            strokeStyle:"black",
            lineWidth:4,
        });

        ctx.beginPath();
        drawRounded(this.x, this.y, this.w, this.h, 16, ctx);
        ctx.fill(); ctx.restore(); ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = rgb(colors.uiDark);

        let sectionWidth = 260;
        let sectionHeight = 380;
        let spaceBetween = (this.w - sectionWidth * 2) / 3;
        let sectionOffset = this.h - sectionHeight - spaceBetween;

        ctx.beginPath();
        ctx.rect(this.x + spaceBetween,this.y + sectionOffset,sectionWidth, sectionHeight);
        ctx.rect(this.x + sectionWidth + (spaceBetween * 2),this.y + sectionOffset,sectionWidth, sectionHeight);
        ctx.fill(); ctx.stroke();
        ctx.closePath();
    }

    renderTopLabel(label) {
        setAttributes(ctx,{
            fillStyle:"white",
            strokeStyle:"black",
            lineWidth:5,
            font:"36px Font1",
            textAlign:"center",
        });

        ctx.beginPath();
        ctx.strokeText(label,this.x + (this.w / 2),this.y + 48);
        ctx.fillText(label,this.x + (this.w / 2),this.y + 48);
        ctx.closePath();
    }
}