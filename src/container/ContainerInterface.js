import { Observable } from "../class/Observable.js";
import { ContainerDisplay } from "./ContainerDisplay.js";


/**
 * The ContainerInterface manages the interactions between the user and ItemContainers,
 * such as moving items within or between containers.
 * A ContainerInterface contains one or more ContainerDisplays, 
 * (where each ContainerDisplay represents one ItemContainer)
 */
export class ContainerInterface {

    #displays = {};

    isOpen = false;

    /** Notify when UI is opened */
    openSubject = new Observable();
    /** Notify when UI is closed */
    closeSubject = new Observable();

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
    }
}