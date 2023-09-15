import { validIndex } from "../helper/helper.js";

export class Grid {
    #width
    #height
    #grid
    #default;
    constructor(width, height, defaultValue = null) {
        this.#width = width;
        this.#height = height;
        this.#default = defaultValue;

        this.#grid = Grid.Empty(this.#width, this.#height, this.#default);
    }

    static Empty(width, height, defaultValue = null) {
        return new Array(width).fill(null).map(function() { 
            return new Array(height).fill(defaultValue)
        });
    }

    //#region Property getters

    get defaultValue() { return this.#default }

    get width() { return this.#width }

    get height() { return this.#height }

    //#endregion

    //#region Grid Getters

    get(x, y) {
        return this.#validPosition(x, y) ? this.#grid[x][y] : this.#default;
    }

    /**
     * @overload
     * Returns a single row. If index is invalid, null is returned
     * @param {number} x Index of row
     * @returns {Array | null}
     */

    /**
     * @overload
     * Returns an array of rows.
     * If the selection goes outside of the grid, those rows are not included.
     * @param {number} x Index of first row
     * @param {number} count Amount of rows to select
     * @returns {Array[]}
     */
    row(y, count) {
        // Overload 1, returns single row
        var getRow = function(y) {
            if(validIndex(y, this.#grid[0])) 
                return this.#grid.map(column => column[y]);
            else 
                return null;
        }
        // Overload 2, returns array of rows
        var getRowSelection = function(y, count) {
            let selection = [];
            for(let i = y; i < y + count; i++) {
                let row = getRow(i);
                if(row != null) selection.push(row);
            }
            return selection;
        }

        if(count == null) {
            return getRow(y);
        } else {
            return getRowSelection(y, count);
        }
    }

    /**
     * @overload
     * Returns a single column.
     * @param {number} x Column index
     * @returns {Array | null}
     */

    /**
     * @overload
     * Returns an array of columns.
     * If the selection goes outside of the grid, those columns are not included.
     * @param {number} x Index of first column
     * @param {number} count Amount of columns to select
     * @returns {Array[]}
     */
    column(x, count) {

        // Overload 1, returns single column
        var getColumn = (x) => {
            return validIndex(x, this.#grid) ? this.#grid[x] : null;
        }
        // Overload 2, returns array of columns
        var getColumnSelection = (x) => {
            let selection = [];
            for(let i = x; i < x + count; i++) {
                let column = getColumn(i);
                if(column != null) selection.push(column);
            }
            return selection;
        }

        if(count == null) {
            return getColumn(x);
        } else {
            return getColumnSelection(x, count);
        }
    }

    asArray() {
        const arr = [];
        for(var column of this.#grid) for (var e of column) arr.push(e);
        return arr;
    }

    /**
     * Returns items in grid
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {boolean} ignoreDefaults If true, 'default' values aren't included 
     * @returns 
     */
    selection(x, y, width, height, ignoreDefaults = false) {
        let selectionArray = [];

        this.column(x, width).forEach(column => {
            selectionArray = selectionArray.concat(column.slice(y, height));
        });

        if(ignoreDefaults) {
            selectionArray = selectionArray.filter(value => value != this.#default);
        }

        return selectionArray;
    }

    //#endregion

    /**
     * Set the value at a position in the grid
     * @param {*} x 
     * @param {*} y 
     * @param {*} value 
     */
    set(x, y, value) {
        if(this.#validPosition(x, y)) {
            this.#grid[x][y] = value || this.#default;
        }
    }

    /**
     * Set value of a grid position to the default value
     * @param {*} x 
     * @param {*} y 
     */
    clear(x, y) {
        this.set(x, y, this.#default);
    }

    #validPosition(x, y) {
        return (validIndex(x, this.#grid) && validIndex(y, this.#grid[0]));
    }
}