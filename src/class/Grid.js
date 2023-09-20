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

    //#region Methods for getting grid data

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

    /**
     * Get all grid items as an array
     * @overload
     * @returns {Array}
     */

    /**
     * @overload
     * @param {boolean} ignoreDefaultValues
     * @returns {Array}
     */

    /**
     * @overload
     * @param {Function} filterExpression 
     * @returns {Array}
     */

    /**
     * @overload
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {Array[]}
     */

    /**
     * @overload
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {boolean} ignoreDefaultValues
     * @returns {Array[]}
     */

    /**
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

    //#endregion

    //#region Other methods

    /**
     * Run callback function for 
     * @param {*} callbackfn 
     */
    forEach(callbackfn) {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                callbackfn(this.get(x, y), x, y);
            }   
        }
    }

    #validPosition(x, y) {
        return (validIndex(x, this.#grid) && validIndex(y, this.#grid[0]));
    }

    //#endregion
}