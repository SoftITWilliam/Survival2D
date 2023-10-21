import { colors } from "../graphics/colors.js";
import { renderPath, rgb, rgba } from "../helper/canvashelper.js";
import { padRect } from "../helper/helper.js";
import { AlignmentX, AlignmentY, getAlignedX, getAlignedY } from "../misc/alignment.js";
import PlayerCamera from "../player/camera.js";

export class ContainerUI {
    #container;
    constructor(container) {

        this.#container = container;

        this.pickedUpStack; 
        this.slotSize = 72;

        this.alignX = AlignmentX.MIDDLE;
        this.alignY = AlignmentY.MIDDLE;

        this.offsetX = 0;
        this.offsetY = 0;

        this.isOpen = false;
    }

    // Override for customization
    onOpen() { }
    onClose() { }

    open() {
        this.isOpen = true;
        this.onOpen();
    }

    close() {
        this.isOpen = false;
        this.onClose();
    }

    getContainerX(camera) {
        let containerWidth = this.#container.width * this.slotSize;
        let x = getAlignedX(camera.x, camera.width, containerWidth, this.alignX);
        return x + this.offsetX;
    }

    getContainerY(camera) {
        let containerHeight = this.#container.height * this.slotSize;
        let y = getAlignedY(camera.y, camera.height, containerHeight, this.alignY);
        return y + this.offsetY;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     * @param {number} sx 
     * @param {number} sy 
     */
    renderSelectionOutline(ctx, camera, sx, sy) {
        const containerX = this.getContainerX(camera);
        const containerY = this.getContainerY(camera);

        let x = containerX + (sx * this.slotSize);
        let y = containerY + (sy * this.slotSize);

        ctx.fillRect(x, y, this.slotSize, this.slotSize);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {PlayerCamera} camera
     * @param {number} [x] Section X (When drawing part of grid only)
     * @param {number} [y] Section Y (When drawing part of grid only)
     * @param {number} [width] Section width (When drawing part of grid only)
     * @param {number} [height] Section height (When drawing part of grid only)
     */
    render(ctx, camera, x, y, width, height) {

        x ??= 0, y ??= 0;
        width ??= this.#container.width, height ??= this.#container.height;

        const x1 = this.getContainerX(camera);
        const y1 = this.getContainerY(camera);

        this.#renderBg(ctx,
            x1 + x * this.slotSize, y1 + y * this.slotSize,
            width * this.slotSize, height * this.slotSize
        );

        let p = 4;
        ctx.fillStyle = rgba(colors.black, 0.4);

        this.#container.slots.forEach((slot, gx, gy) => {

            if(gx < x || gx > x + width) return;
            if(gy < y || gy > y + height) return;
            
            let slotX = x1 + (gx * this.slotSize) + p,
                slotY = y1 + (gy * this.slotSize) + p;

            ctx.fillRect(slotX, slotY, this.slotSize - p * 2, this.slotSize - p * 2);
        }) 
    }

    #renderBg(ctx, x, y, width, height) {

        const lw = 0;
        const pad = 8;

        Object.assign(ctx, { 
            strokeStyle: rgb(colors.uiLight), fillStyle: rgba(colors.uiLight, 0.4), lineWidth: lw
        });

        const rect1 = { x, y, width, height };
        padRect(rect1, lw + pad);

        renderPath(ctx, () => {
            ctx.rectObj(rect1);
            
            ctx.fill();
        })

        if(lw > 0) {
            const rect2 = { x, y, width, height };
            padRect(rect2, lw);
            renderPath(ctx, () => {
                ctx.rectObj(rect2);
                ctx.stroke();
            })
        }
    }

    getHoveredSlot(camera) {
        let cx = this.getContainerX(camera);
        let cy = this.getContainerY(camera);
    } 
}