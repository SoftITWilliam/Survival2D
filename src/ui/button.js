import { ctx } from "../game/global.js";
import { renderPath, rgb, rgbm } from "../game/graphics/renderUtil.js";
import { drawRounded, mouseOn, setAttributes } from "../misc/util.js";


export default class Button {
    #x;
    #y;
    #w;
    #h;
    #clickable;
    #hovering;
    #color;
    #radius;
    #text;
    #textColor;
    #font;
    #fontSize;
    #onClick;
    
    constructor() {
        this.onClick;
        this.#x;
        this.#y;
        this.#w;
        this.#h;
        this.#color = {r:0,g:0,b:0};
        this.#radius = 0;
        this.#clickable = true;
        this.#hovering = false;
        this.#onClick = () => {};
    }

    // Set width and height attribute
    setSize(width, height) {
        this.#w = width;
        this.#h = height;
    }

    getWidth() {
        return this.#w;
    }

    getHeight() {
        return this.#h;
    }

    // Set position attribute, update every frame.
    setPosition(x,y) {
        this.#x = x;
        this.#y = y;
    }

    setText(text,color,font,size) {
        this.#text = text;
        this.#textColor = color;
        this.#font = font;
        this.#fontSize = size;
    }

    setDisplay(color,borderRadius) {
        this.#color = color;
        this.#radius = borderRadius;
    }

    setClickable(c) {
        if(c !== true && c !== false) {
            return;
        }
        this.#clickable = c;
    }

    // Set onClick function
    setOnClick(onClick) {
        this.#onClick = onClick;
    }

    // Check for click and hover
    update(input) {
        if(!this.#clickable) {
            return;
        }

        if(!mouseOn({x:this.#x,y:this.#y,w:this.#w,h:this.#h},input.mouse)) {
            this.#hovering = false;
            return;
        }

        this.#hovering = true;
        document.body.style.cursor = "pointer";
        if(input.mouse.click) {
            this.#onClick();
            input.mouse.click = false;
        }
    }

    // Render button on canvas
    render() {
        if(this.#hovering) {
            ctx.fillStyle = rgbm(this.#color,1.3);
        } else {
            ctx.fillStyle = rgb(this.#color);
        }

        renderPath(() => {
            drawRounded(this.#x,this.#y,this.#w,this.#h,this.#radius,ctx);
            ctx.fill(); ctx.restore();
        });

        setAttributes(ctx,{
            fillStyle: this.#textColor,
            font: this.#fontSize + "px " + this.#font,
            textAlign: "center",
        });

        ctx.fillText(this.#text, this.#x + this.#w / 2, this.#y + this.#h / 2 + this.#fontSize / 3);
    }
}