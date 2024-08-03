
const $DEBUG_INFO =  $('#debug-info');

/**
 * @typedef {object} row
 * @property {string} title
 * @property {() => (string|number|object)} valueFn
 */

export class DebugUI {

    /** @type {{id: string, title: string, valueFn: Function}[]} */
    #rows = [];

    /**
     * @param {string} title 
     * @param {() => (string|number|object)} valueFn 
     * @returns 
     */
    addInfoRow(id, title, valueFn) {
        const $p = $('<p>')
            .attr('id', id)
            .text(title + ':')
            .appendTo($DEBUG_INFO);

        this.#rows.push({ id, title, valueFn });
        return this;
    }

    updateRow(id, value) {
        const row = this.#rows.find(r => r.id === id);
        if(!row) 
            throw new Error('Row not found');

        let text = `${row.title}: `;

        if(typeof value == "object") {
            const valueArr = [];
            for(const key in value) {
                valueArr.push(`${key}: ${value[key]}`);
            }
            text += `(${valueArr.join(", ")})`;
        } else {
            text += value ?? "-";
        }

        document.getElementById(id).textContent = text;
    }
}