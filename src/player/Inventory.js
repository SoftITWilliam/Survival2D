import { Observable } from "../class/Observable.js";
import { Range } from "../class/Range.js";
import { ContainerUI } from "../container/ContainerUI.js";
import { ItemContainer } from "../container/ItemContainer.js";
import { InputHandler } from "../game/InputHandler.js";
import { canvas } from "../game/global.js";
import { renderPath } from "../helper/canvashelper.js";
import { padRect, validNumbers } from "../helper/helper.js";
import { AlignmentY } from "../misc/alignment.js";
import PlayerCamera from "./camera.js";

export class PlayerInventory {
    #selectedIndex = 0;

    selectionChangedSubject = new Observable();

    /**
     * @param {number} width Inventory width (Amount of slots)
     * @param {number} height Inventory height (Amount of slots)
     */
    constructor(width, height) {

        this.container = new ItemContainer(width, height);

        this.ui = new ContainerUI(this.container);
        this.ui.alignY = AlignmentY.BOTTOM;
        this.ui.offsetY = -(this.ui.slotSize / 2);

        this.container.itemAddedSubject.subscribe(({ item, amount, gridX, gridY }) => {
            if(gridX === this.selectedIndex && gridY === this.container.height - 1) {
                this.selectionChangedSubject.notify(this.container.get(gridX, gridY));
            }
        })
    }

    get width() { return this.container.width }
    get height() { return this.container.height }

    get selectedIndex() { return this.#selectedIndex }
    set selectedIndex(i) {
        if(validNumbers(i) == false) 
            throw new TypeError("Index is not a number");
        if(i < 0 || this.width <= i) 
            throw new RangeError(`Index '${i}' out of range (Must be 0-${this.width - 1})`)
        if(i !== this.#selectedIndex) 
            this.selectionChangedSubject.notify(this.container.get(i, this.container.height - 1));
        this.#selectedIndex = i;
    }

    get isOpen() { return this.ui.isOpen }
    

    open() { this.ui.open() }
    close() { this.ui.close() }
    toggle() { this.isOpen ? this.close() : this.open() }

    getSelectedSlot() {
        return this.container.get(this.#selectedIndex, this.container.height - 1);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     * @param {InputHandler} input 
     */
    render(ctx, camera, input) {

        // Render full inventory
        if(this.isOpen) {
            this.ui.render(ctx, camera);
            this.ui.renderItems(ctx, camera); 

            // Hover overlay
            const hovered = this.ui.getHovered(camera, input);
            if(hovered !== null) {
                document.body.style.cursor = "pointer";
                this.ui.renderHoverOverlay(ctx, camera, hovered.x, hovered.y);
            }
        } 
        // Render hotbar only
        else {
            this.ui.render(ctx, camera, 0, this.height - 1, this.width, 1);
            this.ui.renderItems(ctx, camera, 0, this.height - 1, this.width, 1); 
        }

        this.#renderHotbarNumbers(ctx, camera);
        this.#renderSelectionIndicator(ctx, camera, this.selectedIndex);

        
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     * @param {number} slotIndex 
     */
    #renderSelectionIndicator(ctx, camera, slotIndex) {
        const lineWidth = 2;
        const { x, y } = this.ui.getSlotPosition(camera, slotIndex, this.container.height - 1);
        const rect = { x, y, width: this.ui.slotSize, height: this.ui.slotSize }
        padRect(rect, lineWidth / 2);

        renderPath(ctx, () => {
            Object.assign(ctx, { strokeStyle: 'rgba(220,230,250,0.5)', lineWidth });
            ctx.rectObj(rect);
            ctx.stroke();
        })
    }

    #renderHotbarNumbers(ctx, camera) {

        Object.assign(ctx, {
            fillStyle: "rgb(100,100,100)", strokeStyle: "black", font: "18px Font1",
            textAlign: "left", textBaseline: "top", lineWidth: 3
        })

        const offsetPx = 6;
        const slotIndex = this.height - 1;

        renderPath(ctx, () => {
            for(const i of Range(0, this.width)) {
                let pos = this.ui.getSlotPosition(camera, i, slotIndex);
                ctx.drawOutlinedText(i + 1, pos.x + offsetPx, pos.y + offsetPx - 2);
            }
        })
    }
}