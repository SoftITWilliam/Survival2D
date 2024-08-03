import { Observable } from "../class/Observable.js";

export class StatBar { 
    #value = 0;
    #max = 0;

    valueChanged = new Observable();
    capacityChanged = new Observable();

    /**
     * @param {number} max 
     * @param {number} startValue 
     */
    constructor(max, startValue) {
        this.max = max;
        this.value = startValue;
    }

    get value() {
        return this.#value;
    }
    set value(v) {
        console.assert(typeof v === 'number' && !isNaN(v), 'Invalid type');
        this.#value = v;
        this.valueChanged.notify(v);
    }

    get max() {
        return this.#max;
    }
    set max(v) {
        console.assert(typeof v === 'number' && !isNaN(v), 'Invalid type');
        this.#max = v;
        this.capacityChanged.notify(v);
    }

    increaseBy(amount) {
        console.assert(typeof amount === 'number' && !isNaN(amount), 'Invalid type');
        console.assert(amount >= 0, 'Can not be negative');
        this.value = Math.max(this.value + amount, this.max);
    }

    decreaseBy(amount) {
        console.assert(typeof amount === 'number' && !isNaN(amount), 'Invalid type');
        console.assert(amount >= 0, 'Can not be negative');
        this.value = Math.max(this.value - amount, 0);
    }
}
