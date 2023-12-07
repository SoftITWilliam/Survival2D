import { validIndex } from "../helper/helper.js";
import { Range } from "./Range.js";

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

    /**
     * Returns a 2d array, with a specific width and height.
     * @param {number} width Amount of columns
     * @param {number} height Amount of rows
     * @param {any} [defaultValue] Value inserted into every position in the grid. Works with methods. (default: null)
     * @returns {Array[]}
     */
    static Empty(width, height, defaultValue = null) {
        let isFunction = (typeof defaultValue == "function");
        const getDefault = (isFunction ? () => defaultValue() : () => defaultValue);
        return new Array(width).fill(null).map(function() {
            return new Array(height).fill(getDefault());
        });
    }

    //#region Property getters

    get defaultValue() { return this.#default }

    /** @returns {number} */
    get width() { return this.#width }

    /** @returns {number} */
    get height() { return this.#height }

    //#endregion

    //#region Property setters

    //#endregion

    //#region Methods for getting grid data

    /**
     * Returns the value stored at a position of this grid.
     * If position arguments are invalid, the 'default' value is returned.
     * @param {number} x X index (column)
     * @param {number} y Y index (row)
     * @returns Stored value at grid position
     */
    get(x, y) {
        return (this.#validPosition(x, y) ? this.#grid[x][y] : this.#default);
    }

    /**
     * Returns the value stored at a position of this grid.
     * If invalid position arguments are provided, an error is thrown.
     * @param {number} x X index (column)
     * @param {number} y Y index (row)
     * @returns Stored value at grid position
     */
    requireGet(x, y) {
        if(this.#validPosition(x, y) == false) 
            throw new RangeError(`Invalid grid position (${x},${y})`);
        else return this.#grid[x][y];
    }

    /**
     * Returns true if value at the provided position is same as default value
     * @param {number} x X index (column)
     * @param {number} y Y index (row)
     * @returns {boolean}
     */
    isEmptyAt(x, y) {
        return (this.get(x, y) == this.#default)
    }

    /**
     * @overload
     * Returns a single row. If index is invalid, null is returned
     * @param {number} x Index of row
     * @returns {Array | null}
     * 
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
            for(const i of Range(y, y + count)) {
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
     * 
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
            for(let i of Range(x, x + count)) {
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

    /**
     * Get all grid items as an array
     * @overload
     * @returns {Array}
     * 
     * Get all non-default grid items as an array
     * @overload
     * @param {boolean} ignoreDefaultValues
     * @returns {Array}
     * 
     * Get all grid items as an array, filtered
     * @overload
     * @param {Function} filterExpression 
     * @returns {Array}
     * 
     * Get items from a part of the grid, as an array
     * (If selection overflows grid size, those values are ignored)
     * @overload
     * @param {number} x Selection X
     * @param {number} y Selection Y
     * @param {number} width Selection width
     * @param {number} height Selection height
     * @returns {Array[]}
     * 
     * Get non-default items from a part of the grid, as an array
     * (If selection overflows grid size, those values are ignored)
     * @overload
     * @param {number} x Selection X
     * @param {number} y Selection Y
     * @param {number} width Selection width
     * @param {number} height Selection height
     * @param {boolean} ignoreDefaultValues
     * @returns {Array[]}
     * 
     * Get items from a part of the grid, as an array, filtered
     * @overload
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {Function} filterExpression
     * @returns {Array[]}
     */
    asArray(arg1, arg2, arg3, arg4, arg5) {
        let arr = [];

        // Overload 1-3
        var getAll = () => {
            let a = [];
            for(var column of this.#grid) for (var e of column) a.push(e);
            return a;
        }

        // Overload 4-5
        var getSelection = (x, y, width, height) => {
            let a = [];
            for(let gx = x; gx < x + width; gx++) {

                let column = this.column(gx);
                if(!column) continue;
    
                for(let gy = y; gy < y + height; gy++) {
                    if(gy >= 0 && gy < column.length) a.push(column[gy]);
                }
            }
            return a;
        }

        // Overload routing
        if(arg1 != null && arg2 != null && arg3 != null && arg4 != null) {
            arr = getSelection(arg1, arg2, arg3, arg4);
            var filterExpression = arg5;
        }
        else {
            arr = getAll();
            var filterExpression = arg1;
        }

        // Filtering
        if(typeof filterExpression == "function") 
            arr = arr.filter(filterExpression);
        
        else if(filterExpression === true) 
            arr = arr.filter(value => value != this.#default);

        return arr;
    }

    //#endregion

    //#region Methods for modifying the grid

    /**
     * Set the value at a position in the grid.
     * If invalid position arguments are provided, nothing happens.
     * @param {number} x X index (column)
     * @param {number} y Y index (row)
     * @param {any} value New value
     */
    set(x, y, value) {
        if(this.#validPosition(x, y)) this.#grid[x][y] = value;
    }

    /**
     * Set value of a grid position to the default value
     * @param {number} x
     * @param {number} y
     */
    clear(x, y) {
        this.set(x, y, this.#default);
    }

    //#endregion

    //#region Iteration

    /**
     * Run callback function for every item in the grid.
     * @param {(value: any, x: number, y: number) => void} callbackfn 
     */
    forEach(callbackfn) {
        for(const x of Range(0, this.width)) {
            for(const y of Range(0, this.height)) {
                callbackfn(this.get(x, y), x, y);
            }   
        }
    }

    /**
     * Run callback function for every item in the grid.
     * If a value is returned, it replaces the item in the grid.
     * @param {(value: any, x: number, y: number) => any|undefined} callbackfn
     */
    eachItem(callbackfn) {
        this.forEach((value, x, y) => {
            let result = callbackfn(value, x, y);
            if(result !== undefined) {
                this.set(x, y, result);
            }
        })
    }

    /**
     * Returns position of the first item where the predicate returns true. Null if not found
     * @param {(value: any) => boolean} predicate 
     * @returns {{x: number, y: number}|null}
     */
    positionOf(predicate) {
        for(const y of Range(0, this.height)) {
            for(const x of Range(0, this.width)) {
                const value = this.get(x, y)
                if(predicate(value)) return { x, y }
            }   
        }
        return null;
    }

    *[Symbol.iterator]() {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                yield this.get(x, y)
            }   
        }
    }

    //#endregion

    //#region Private methods

    /**
     * Returns true if x and y is a valid grid position (numerical values within grid size)
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    #validPosition(x, y) {
        return (validIndex(x, this.#grid) && validIndex(y, this.#grid[0]));
    }

    //#endregion
}