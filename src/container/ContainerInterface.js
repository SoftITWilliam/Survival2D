import { Observable } from "../class/Observable.js";
import { InputHandler } from "../game/InputHandler.js";
import { Game } from "../game/game.js";
import Item from "../item/item.js";
import { ItemStack } from "../item/itemStack.js";
import PlayerCamera from "../player/camera.js";
import { Player } from "../player/player.js";
import { ContainerDisplay } from "./ContainerDisplay.js";


/**
 * The ContainerInterface manages the interactions between the user and ItemContainers,
 * such as moving items within or between containers.
 * A ContainerInterface contains one or more ContainerDisplays, 
 * (where each ContainerDisplay represents one ItemContainer)
 */
export class ContainerInterface {

    #displays = {};

    /** @type {boolean} */
    isOpen = false;
    /** @type {ItemStack|null} */
    grabbedStack = null;

    /** Notify when UI is opened */
    openSubject = new Observable();
    /** Notify when UI is closed */
    closeSubject = new Observable();

    /**
     * @param {Game} game 
     */
    constructor(game) {

        game.input.leftClick.subscribe(() => {
            const hovered = this.getHovered(game.player.camera, game.input);

            if (hovered === null)
                return;

            const container = hovered.display.container;

            if (this.grabbedStack !== null) {
                // Insert into slot / swap stacks
                this.grabbedStack = container.insertAt(hovered.x, hovered.y, this.grabbedStack);
            }
            else {
                // Grab slot contents
                this.grabbedStack = container.grab(hovered.x, hovered.y);
            }
        });

        game.input.rightClick.subscribe(() => {
            const hovered = this.getHovered(game.player.camera, game.input);

            if (hovered === null)
                return;

            const container = hovered.display.container;

            if (this.grabbedStack !== null) {
                // Add single item into slot
                this.grabbedStack = container.insertAt(hovered.x, hovered.y, this.grabbedStack, 1);
            }
            else if(container.get(hovered.x, hovered.y) !== null) {
                // Grab slot contents
                this.grabbedStack = container.get(hovered.x, hovered.y).split();
                container.clearEmptySlots();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.openSubject.notify();
    }

    close() {
        this.isOpen = false;
        this.closeSubject.notify();
    }

    /**
     * Add a ContainerDisplay to the interface
     * @param {ContainerDisplay} display 
     */
    addDisplay(display, key) {
        if (display instanceof ContainerDisplay == false)
            throw new TypeError("Argument 'display' must be of type 'ContainerDisplay'");

        if (typeof key != "string")
            throw new TypeError("Argument 'key' must be of type 'string'");
    
        this.#displays[key] = display;
    } 

    getDisplay(key) {
        if (typeof key != "string")
            throw new TypeError("Argument 'key' must be of type 'string'");

        return this.#displays[key];
    }

    /**
     * @param {PlayerCamera} camera 
     * @param {InputHandler} input 
     * @returns {{x: number, y: number, display: ContainerDisplay}|null}
     */
    getHovered(camera, input) {

        for (const key in this.#displays) {
            const display = this.#displays[key];

            const pad = display.padding;

            const mx = input.mouse.mapX - display.getContainerX(camera) - (pad / 2);
            const my = -(input.mouse.mapY + display.getContainerY(camera)) - (pad / 2);
    
            const inRangeX = (0 <= mx && mx < display.getContainerWidthPx() - pad);
            const inRangeY = (0 <= my && my < display.getContainerHeightPx() - pad);
    
            if (inRangeX && inRangeY) {
                return {
                    x: Math.floor(mx / (display.slotSize + pad)),
                    y: Math.floor(my / (display.slotSize + pad)),
                    display: display
                }
            }
            return null;
        }
    } 

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     * @param {InputHandler} input 
     */
    render(ctx, camera, input) {

        for (const key in this.#displays) {
            this.#displays[key].render(ctx, camera);
            this.#displays[key].renderItems(ctx, camera);
        }

        const hovered = this.getHovered(camera, input);
        if(hovered !== null) {
            document.body.style.cursor = "pointer";
            hovered.display.renderSlotHighlight(ctx, camera, hovered.x, hovered.y);
        }

        if(this.isOpen && this.grabbedStack !== null) {
            const stack = this.grabbedStack;
            const x = camera.x + input.mouse.x;
            const y = camera.y + input.mouse.y;
            stack.item.render(ctx, x, y, stack.size, stack.size);

            const size = ContainerDisplay.SlotSizePx - ContainerDisplay.PaddingPx * 2;
            const offset = 5;

            Object.assign(ctx, ContainerDisplay.ItemCountTextStyle);

            ctx.drawOutlinedText(stack.amount, x + size - offset, y + size - offset + 2);
        }
    }
    
    #renderItemAmounts() {
        const pos = this.getSlotPosition(camera, gx, gy);
        const offset = 5;

        Object.assign(ctx, {
            fillStyle: 'rgb(200,205,215)', 
            strokeStyle: 'black', 
            font: '22px Font1',
            textAlign: 'right', 
            textBaseline: 'bottom', 
            lineWidth: 3
        })

        ctx.drawOutlinedText(amount, pos.x + this.slotSize - offset, pos.y + this.slotSize - offset + 2);
    }
}