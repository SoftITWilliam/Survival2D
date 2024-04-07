import { Observable } from "../class/Observable.js";
import { Range } from "../class/Range.js";
import { ContainerDisplay } from "../container/ContainerDisplay.js";
import { ContainerInterface } from "../container/ContainerInterface.js";
import { ItemContainer } from "../container/ItemContainer.js";
import { InputHandler } from "../game/InputHandler.js";
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

        const display = new ContainerDisplay(this.container);
        display.alignY = AlignmentY.BOTTOM;
        display.offsetY = -(display.slotSize / 2);

        this.interface = new ContainerInterface();
        this.interface.addDisplay(display, 'INVENTORY');

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

    get isOpen() { return this.interface.isOpen }
    

    open() { this.interface.open() }
    close() { this.interface.close() }
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

        const display = this.interface.getDisplay('INVENTORY');

        // Render full inventory
        if(this.isOpen) {
            this.interface.render(ctx, camera, input);

            // Hover overlay
            const hovered = this.interface.getHovered(camera, input);
        } 
        // Render hotbar only
        else {
            display.render(ctx, camera, 0, this.height - 1, this.width, 1);
            display.renderItems(ctx, camera, 0, this.height - 1, this.width, 1); 
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
        const display = this.interface.getDisplay('INVENTORY');
        const lineWidth = 2;
        const { x, y } = display.getSlotPosition(camera, slotIndex, this.container.height - 1);
        const rect = { x, y, width: display.slotSize, height: display.slotSize }
        padRect(rect, lineWidth / 2);

        renderPath(ctx, () => {
            Object.assign(ctx, { strokeStyle: 'rgba(220,230,250,0.5)', lineWidth });
            ctx.rectObj(rect);
            ctx.stroke();
        })
    }

    #renderHotbarNumbers(ctx, camera) {
        const display = this.interface.getDisplay('INVENTORY');

        Object.assign(ctx, {
            fillStyle: "rgb(100,100,100)", strokeStyle: "black", font: "18px Font1",
            textAlign: "left", textBaseline: "top", lineWidth: 3
        })

        const offsetPx = 6;
        const slotIndex = this.height - 1;

        renderPath(ctx, () => {
            for(const i of Range(0, this.width)) {
                let pos = display.getSlotPosition(camera, i, slotIndex);
                ctx.drawOutlinedText(i + 1, pos.x + offsetPx, pos.y + offsetPx - 2);
            }
        })
    }
}