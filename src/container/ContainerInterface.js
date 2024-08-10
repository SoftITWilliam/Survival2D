import { Observable } from "../class/Observable.js";
import { InputHandler } from "../game/InputHandler.js";
import { Game } from "../game/game.js";
import { ItemStack } from "../item/itemStack.js";
import PlayerCamera from "../player/camera.js";
import { ContainerDisplay } from "./ContainerDisplay.js";
import { ItemContainer } from "./ItemContainer.js";

const $GRABBED = ContainerDisplay.$newSlot();
$GRABBED.addClass('grabbed');
$GRABBED.appendTo('.ui-wrapper');

/**
 * The ContainerInterface manages the interactions between the user and ItemContainers,
 * such as moving items within or between containers.
 * A ContainerInterface contains one or more ContainerDisplays, 
 * (where each ContainerDisplay represents one ItemContainer)
 */
export class ContainerInterface {

    /** @type {Map<string, ContainerDisplay>} */
    #displays = new Map();

    /** @type {boolean} */
    isOpen = false;
    /** @type {ItemStack|null} */
    grabbedStack = null;

    /** Notify when UI is opened */
    openSubject = new Observable();
    /** Notify when UI is closed */
    closeSubject = new Observable();
    /** Notify when an item is 'grabbed', 'ungrabbed' or if the amount of grabbed items are changed. */
    grabSubject = new Observable();
    /** Notify when a slot is left clicked */
    slotLeftClick = new Observable();
    /** Notify when a slot is right clicked */
    slotRightClick = new Observable();
    /** Notify when mouse enters a slot */
    slotHoverSubject = new Observable(); // ({ x, y, stack }) => { }
    /** Notify when mouse exits a slot */
    slotHoverOutSubject = new Observable(); // ({ x, y, stack }) => { }

    /**
     * @param {Game} game 
     */
    constructor(game) {

        this.slotLeftClick.subscribe(({ display, x, y }) => this.handleSlotLeftClick(display, x, y));
        this.slotRightClick.subscribe(({ display, x, y }) => this.handleSlotRightClick(display, x, y));

        this.grabSubject.subscribe(() => {
            ContainerDisplay.updateSlotContents($GRABBED, this.grabbedStack);
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
     * @param {ContainerDisplay} display 
     * @param {number} x 
     * @param {number} y 
     */
    handleSlotLeftClick(display, x, y) {
        if (this.grabbedStack !== null) {
            // Insert into slot / swap stacks
            this.grabbedStack = display.container.insertAt(x, y, this.grabbedStack);
            this.grabSubject.notify(this.grabbedStack);
        }
        else {
            // Grab slot contents
            this.grabbedStack = display.container.grab(x, y);
            this.grabSubject.notify(this.grabbedStack);
        }
    }

    /**
     * @param {ContainerDisplay} display 
     * @param {number} x 
     * @param {number} y 
     */
    handleSlotRightClick(display, x, y) {
        if (this.grabbedStack !== null) {
            // Add single item into slot
            this.grabbedStack = display.container.insertAt(x, y, this.grabbedStack, 1);
            this.grabSubject.notify(this.grabbedStack);
        }
        else if(display.container.get(x, y) !== null) {
            // Grab slot contents
            this.grabbedStack = display.container.split(x, y);
            this.grabSubject.notify(this.grabbedStack);
            display.container.clearEmptySlots();
        }
    }

    /**
     * Add a ContainerDisplay to the interface
     * @param {ContainerDisplay} display 
     * @param {string} key
     */
    addDisplay(display, key) {
        console.assert(display instanceof ContainerDisplay, "Argument 'display' must be of type 'ContainerDisplay'");
        console.assert(typeof key === "string", "Argument 'key' must be of type 'string'");
        this.#displays.set(key, display);

        display.$.on('mousedown', '.slot', e => {
            const { x, y } = this.#getSlotPosition($(e.currentTarget));            

            if(e.which === 1) {
                this.slotLeftClick.notify({ display, x, y });
            }
            else if(e.which === 3) {
                this.slotRightClick.notify({ display, x, y });
            }
        });

        display.$.on('mouseenter', '.slot', e => {
            const { x, y } = this.#getSlotPosition($(e.currentTarget));
            const stack = display.container.get(x, y);
            this.slotHoverSubject.notify({ x, y, stack });
        });

        display.$.on('mouseleave', '.slot', e => {
            const { x, y } = this.#getSlotPosition($(e.currentTarget));
            const stack = display.container.get(x, y);
            this.slotHoverOutSubject.notify({ x, y, stack });
        });
    }

    #getSlotPosition($e) {
        return { 
            x: $e.closest('.slot').index(), 
            y: $e.closest('.row').index() 
        };
    }

    /**
     * @param {string} key 
     * @returns {ContainerDisplay}
     */
    getDisplay(key) {
        console.assert(typeof key === "string", "Argument 'key' must be of type 'string'");
        return this.#displays.get(key);
    }

    /**
     * @param {string} key 
     * @returns {ItemContainer}
     */
    getContainer(key) {
        console.assert(typeof key === "string", "Argument 'key' must be of type 'string'");
        return this.#displays.get(key);
    }

    /**
     * @param {InputHandler} input 
     */
    updateGrabbedPosition(input) {
        if(this.isOpen && this.grabbedStack !== null) {
            $GRABBED.css('left', (input.mouse.x + 4) + 'px');
            $GRABBED.css('top', (input.mouse.y + 4) + 'px');
        }
    }
}