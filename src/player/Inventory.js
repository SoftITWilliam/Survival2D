import { Observable } from "../class/Observable.js";
import { Range } from "../class/Range.js";
import { ContainerDisplay } from "../container/ContainerDisplay.js";
import { ContainerInterface } from "../container/ContainerInterface.js";
import { ItemContainer } from "../container/ItemContainer.js";
import { InputHandler } from "../game/InputHandler.js";
import { Game } from "../game/game.js";
import { renderPath } from "../helper/canvashelper.js";
import { padRect, validNumbers } from "../helper/helper.js";
import { AlignmentY } from "../misc/alignment.js";
import PlayerCamera from "./camera.js";

const $INVENTORY = $('.inventory');

export class PlayerInventory {
    #selectedIndex = 0;

    selectionChangedSubject = new Observable();

    /**
     * @param {number} width Inventory width (Amount of slots)
     * @param {number} height Inventory height (Amount of slots)
     * @param {Game} game Game object
     */
    constructor(width, height, game) {

        this.container = new ItemContainer(width, height);
        this.display = new ContainerDisplay(this.container, $INVENTORY);

        this.interface = new ContainerInterface(game, game.player);
        this.interface.addDisplay(this.display, 'INVENTORY');

        this.container.itemAddedSubject.subscribe(({ item, amount, gridX, gridY }) => {
            if(gridX === this.selectedIndex && gridY === this.container.height - 1) {
                this.selectionChangedSubject.notify(this.container.get(gridX, gridY));
            }
        })

        // Populate with rows and slots
        this.display.createSlots();
        $INVENTORY.children().last().addClass('hotbar');

        this.interface.openSubject.subscribe(() => $INVENTORY.toggleClass('open', true));
        this.interface.closeSubject.subscribe(() => $INVENTORY.toggleClass('open', false));
    }

    get width() { return this.container.width }
    get height() { return this.container.height }

    get selectedIndex() { return this.#selectedIndex }
    set selectedIndex(i) {
        console.assert(validNumbers(i), "Index is not a number");
        console.assert(0 <= i && i < this.width, `Index '${i}' out of range (Must be 0-${this.width - 1})`);

        if(i !== this.#selectedIndex) 
            this.selectionChangedSubject.notify(this.container.get(i, this.container.height - 1));
        this.#selectedIndex = i;

        const $hotbar = this.display.$row(this.container.height - 1);
        $hotbar.find('.selected').toggleClass('selected', false);
        $hotbar.children().eq(i).toggleClass('selected', true);
    }

    get isOpen() { return this.interface.isOpen; }

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
        if(this.isOpen) {
            this.interface.updateGrabbedPosition(input);
        } 
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     * @param {number} slotIndex 
     */
    #renderSelectionIndicator(ctx, camera, slotIndex) {
        return;
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
        return;
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