import { Observable } from "../class/Observable.js";
import { InputHandler } from "../game/InputHandler.js";
import { colors } from "../graphics/colors.js";
import { renderPath, rgb, rgba } from "../helper/canvashelper.js";
import { padRect } from "../helper/helper.js";
import { AlignmentX, AlignmentY, getAlignedX, getAlignedY } from "../misc/alignment.js";
import PlayerCamera from "../player/camera.js";
import { ItemContainer } from "./ItemContainer.js";

export class ContainerUI {
    #container;

    pickedUpStack = null; 
    slotSize = 64;
    alignX = AlignmentX.MIDDLE;
    alignY = AlignmentY.MIDDLE;
    offsetX = 0;
    offsetY = 0;
    isOpen = false;
    padding = 8;

    /** Notify when UI is opened */
    openSubject = new Observable();
    /** Notify when UI is closed */
    closeSubject = new Observable();

    /**
     * @param {ItemContainer} container 
     */
    constructor(container) {
        this.#container = container;
    }

    open() {
        this.isOpen = true;
        this.openSubject.notify();
    }

    close() {
        this.isOpen = false;
        this.closeSubject.notify();
    }

    getContainerWidthPx() {
        return this.#container.width * (this.slotSize + this.padding) + this.padding;
    }

    getContainerHeightPx() {
        return this.#container.height * (this.slotSize + this.padding) + this.padding;
    }

    /**
     * @param {PlayerCamera} camera 
     * @returns {number}
     */
    getContainerX(camera) {
        let x = getAlignedX(camera.x, camera.width, this.getContainerWidthPx(), this.alignX);
        return Math.floor(x + this.offsetX);
    }

    /**
     * @param {PlayerCamera} camera 
     * @returns {number}
     */
    getContainerY(camera) {
        let y = getAlignedY(camera.y, camera.height, this.getContainerHeightPx(), this.alignY);
        return Math.floor(y + this.offsetY);
    }

    /**
     * @param {PlayerCamera} camera 
     * @param {number} gx 
     * @param {number} gy 
     */
    getSlotPosition(camera, gx, gy) {
        let px = (gx + 1) * this.padding;
        let py = (gy + 1) * this.padding;
        let x = this.getContainerX(camera) + (gx * this.slotSize) + px;
        let y = this.getContainerY(camera) + (gy * this.slotSize) + py;
        return { x, y }
    }

    /**
     * @param {PlayerCamera} camera 
     * @param {InputHandler} input 
     */
    getHovered(camera, input) {
        const p = this.padding / 2;
        const mx = input.mouse.mapX - this.getContainerX(camera) - p;
        const my = -(input.mouse.mapY + this.getContainerY(camera)) - p;

        let inRangeX = (0 <= mx && mx < this.getContainerWidthPx() - this.padding);
        let inRangeY = (0 <= my && my < this.getContainerHeightPx() - this.padding);

        if (inRangeX && inRangeY) {
            return {
                x: Math.floor(mx / (this.slotSize + this.padding)),
                y: Math.floor(my / (this.slotSize + this.padding))
            }
        }
        return null;
    } 

    //#region Rendering

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

        const bgx = x1 + x * (this.slotSize + this.padding);
        const bgy = y1 + y * (this.slotSize + this.padding);
        const bgw = width * (this.slotSize + this.padding) + this.padding;
        const bgh = height * (this.slotSize + this.padding) + this.padding;

        this.#renderBg(ctx, bgx, bgy, bgw, bgh);

        ctx.fillStyle = rgba(colors.black, 0.4);

        this.#container.slots.forEach((slot, gx, gy) => {

            if(gx < x || gx > x + width) return;
            if(gy < y || gy > y + height) return;
            
            const slotPos = this.getSlotPosition(camera, gx, gy);

            ctx.fillRect(slotPos.x, slotPos.y, this.slotSize, this.slotSize);
        }) 
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {PlayerCamera} camera
     * @param {number} [x] Section X (When drawing part of grid only)
     * @param {number} [y] Section Y (When drawing part of grid only)
     * @param {number} [width] Section width (When drawing part of grid only)
     * @param {number} [height] Section height (When drawing part of grid only)
     */
    renderItems(ctx, camera, x, y, width, height) {
        this.#container.slots.forEach((stack, gx, gy) => {
            if(stack === null) return;
            if(gx < x || gx > x + width) return;
            if(gy < y || gy > y + height) return;

            this.renderItem(ctx, camera, gx, gy);

            if(stack.item.stackSize !== 0) {
                this.#renderItemAmount(ctx, camera, gx, gy, stack.amount);
            }
        }) 
    }

    renderItem(ctx, camera, gx, gy) {
        const pos = this.getSlotPosition(camera, gx, gy);
        const stack = this.#container.get(gx, gy);

        let size = stack.size;
        let offset = (this.slotSize / 2) - size / 2;
        
        stack.item.render(ctx, pos.x + offset, pos.y + offset, size, size);
    }

    #renderItemAmount(ctx, camera, gx, gy, amount) {
        const pos = this.getSlotPosition(camera, gx, gy);
        const offset = 5;

        Object.assign(ctx, {
            fillStyle: 'rgb(200,205,215)', strokeStyle: 'black', font: '22px Font1',
            textAlign: 'right', textBaseline: 'bottom', lineWidth: 3
        })

        ctx.drawOutlinedText(amount, pos.x + this.slotSize - offset, pos.y + this.slotSize - offset + 2);
    }

    #renderBg(ctx, x, y, width, height) {

        const lineWidth = 0;

        Object.assign(ctx, { 
            strokeStyle: rgb(colors.uiLight), 
            fillStyle: rgba(colors.uiLight, 0.5), 
            lineWidth
        });

        const rect1 = { x, y, width, height };

        renderPath(ctx, () => {
            ctx.rectObj(rect1);
            
            ctx.fill();
        })

        if(lineWidth > 0) {
            const rect2 = { x, y, width, height };
            padRect(rect2, lineWidth);
            renderPath(ctx, () => {
                ctx.rectObj(rect2);
                ctx.stroke();
            })
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     * @param {number} gx 
     * @param {number} gy 
     */
    renderHoverOverlay(ctx, camera, gx, gy) {
        const pos = this.getSlotPosition(camera, gx, gy);
        ctx.fillStyle = 'rgba(220,230,250,0.15)';
        ctx.fillRect(pos.x, pos.y, this.slotSize, this.slotSize);
    }

    //#endregion
}