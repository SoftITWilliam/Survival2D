import { ContainerUI } from "../container/ContainerUI.js";
import { ItemContainer } from "../container/ItemContainer.js";
import { renderPath } from "../helper/canvashelper.js";
import { validNumbers } from "../helper/helper.js";
import { AlignmentY } from "../misc/alignment.js";
import PlayerCamera from "./camera.js";

export class PlayerInventory {
    #selectedIndex;
    /**
     * @param {number} width Inventory width (Amount of slots)
     * @param {number} height Inventory height (Amount of slots)
     */
    constructor(width, height) {

        this.container = new ItemContainer(width, height);

        this.ui = new ContainerUI(this.container);
        this.ui.alignY = AlignmentY.BOTTOM;
        this.ui.offsetY = -64;

        this.ui.onOpen = () => {
            //this.ui.alignY = AlignmentY.MIDDLE;
            //this.ui.offsetY = 0;
        }

        this.ui.onClose = () => {
            this.ui.alignY = AlignmentY.BOTTOM;
            this.ui.offsetY = -64;
        }

        this.selectedIndex = 0;
    }

    get width() { return this.container.width }
    get height() { return this.container.height }

    get selectedIndex() { return this.#selectedIndex }
    set selectedIndex(i) {
        if(validNumbers(i) == false) throw new TypeError("Index is not a number");
        if(i < 0 || this.width <= i) throw new RangeError(`Index '${i}' out of range (Must be 0-${this.width - 1})`)
        this.#selectedIndex = i;
    }

    get isOpen() { return this.ui.isOpen }
    

    open() {
        this.ui.open();
    }

    close() {
        this.ui.close();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PlayerCamera} camera 
     */
    render(ctx, camera) {

        // Render full inventory
        if(this.isOpen) {
            this.ui.render(ctx, camera);
        } 
        // Render hotbar only
        else {
            this.ui.render(ctx, camera, 0, this.height - 1, this.width, 1);
        }

        this.#renderHotbarNumbers(ctx, camera);
    }

    #renderHotbarNumbers(ctx, camera) {
        let hotbarX = this.ui.getContainerX(camera);
        let hotbarY = this.ui.getContainerY(camera) + this.ui.slotSize * (this.container.height - 1);

        Object.assign(ctx, {
            fillStyle: "rgb(100,100,100)", strokeStyle: "black", font: "18px Font1",
            textAlign: "left", textBaseline: "top", lineWidth: 3
        })

        const offsetPx = 8;

        renderPath(ctx, () => {
            for(let i = 0; i < this.width; i++) {
                let x = hotbarX + (this.ui.slotSize * i) + offsetPx;
                let y = hotbarY + offsetPx - 2;
                ctx.drawOutlinedText(i + 1, x, y);
            }
        })
    }
}