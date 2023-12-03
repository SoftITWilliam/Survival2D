
export class Observable {

    /** @type {((data: object) => void)[] } */
    #observers = [];

    /**
     * @param {(data: object) => void} func 
     */
    subscribe(func) {
        this.#observers.push(func);
    }

    /**
     * @param {(data: object) => void} func 
     */
    unsubscribe(func) {
        const index = this.#observers.indexOf(func);
        if(index !== -1) {
            this.#observers.splice(index, 1);
        }
    }

    /**
     * @param {(data: object) => void} func 
     * @returns {boolean}
     */
    isSubscribed(func) {
        return this.#observers.indexOf(func) !== -1;
    }

    /**
     * @param {(data: object) => void} func 
     */
    notify(data) {
        this.#observers.forEach(observer => observer(data));
    }
}