import { ItemStack } from "../item/itemStack.js";
import { ItemContainer } from "./ItemContainer.js";

export class ContainerDisplay {
    /** @type {ItemContainer} */
    #container;
    /** @type {JQuery} */
    #element;

    /**
     * @param {ItemContainer} container 
     */
    constructor(container, $element) {
        this.#container = container;
        this.#element = $element;

        this.container.slotContentsChanged.subscribe(({ x, y }) => {
            const $s = this.$slot(x, y);
            const stack = this.container.get(x, y);
            ContainerDisplay.updateSlotContents($s, stack);
        });
    }

    get container() {
        return this.#container;
    }

    get $() {
        return this.#element;
    }

    createSlots() {
        for(let y = 0; y < this.container.height; y++) {
            const $row = $('<div>').addClass('row').appendTo(this.$); 
            for(let x = 0; x < this.container.width; x++) {
                $row.append(ContainerDisplay.$newSlot());
            }
        }
    }

    static $newSlot() {
        const $slot = $('<div>').addClass('slot empty');
        const $item = $('<div>').addClass('item').appendTo($slot);
        $slot.append($('<span>').addClass('quantity text-outline-thin').text('0'));
        $item.append($('<img>').addClass('sprite'));
        return $slot;
    }

    $row(y) {
        return this.$.children().eq(y);
    }

    $slot(x, y) {
        return this.$row(y).children().eq(x);
    }
    
    /**
     * @param {JQuery} $slot 
     * @param {ItemStack} stack 
     */
    static updateSlotContents($slot, stack) {

        $slot.toggleClass('empty', stack === null);

        if (stack) {
            $slot.find('.quantity').text(stack.amount);

            const rend = stack.item.itemRenderer;

            const [x, y, w, h] = [rend.sx, rend.sy, rend.width, rend.height];

            // Calculate scaling factor
            var scaleX = 32 / rend.width;
            var scaleY = 32 / rend.height;

            $slot.find('.sprite')
                .attr('src', rend.source.src)
                .css({
                    'clip-path': `polygon(${x}px ${y}px, ${x + w}px ${y}px, ${x + w}px ${y + h}px, ${x}px ${y + h}px)`,
                    'transform': `scale(${scaleX}, ${scaleY}) translate(-${x}px, -${y}px)`
            });
        }
        else {
            $slot.find('.quantity').text('');
            $slot.find('.item').attr('src', '');
        }
    }

    //#endregion
}