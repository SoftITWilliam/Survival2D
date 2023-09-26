
import { objectHasProperties } from "../helper/helper.js";

const point = (x, y) => ({ x: x, y: y });

class TilesetTemplate {
    #positions;
    #default;
    constructor(positions = {}, defaultValue = point(0, 0)) {
        this.#positions = positions;
        this.#default = defaultValue;
    }

    getPosition(variant) {
        return this.#positions[variant] ?? this.#default;
    }
}

export class Tileset {

    /**
     * @typedef {object} Adjacency
     * @property {boolean} top
     * @property {boolean} bottom
     * @property {boolean} left
     * @property {boolean} right
     * @property {boolean} top_left
     * @property {boolean} top_right
     * @property {boolean} bottom_left
     * @property {boolean} bottom_right
     */

    /**
     * @typedef {Object} Point
     * @property {number} x The X coordinate 
     * @property {number} y The Y coordinate 
     */

    /**
     * @typedef {Object} tilesetTemplate
     * @property {function} getPosition The X coordinate 
     */
    
    static variants = {
        // No adjacent
        SINGLE_TILE: 0,

        // Surface tiles
        SURFACE_TOP: 1,
        SURFACE_BOTTOM: 2,
        SURFACE_LEFT: 3,
        SURFACE_RIGHT: 4,

        // Outer corner tiles
        CORNER_TOP_LEFT: 5,
        CORNER_TOP_RIGHT: 6,
        CORNER_BOTTOM_LEFT: 7,
        CORNER_BOTTOM_RIGHT: 8,

        // Horizontal platform tiles
        HORIZONTAL_PLATFORM_LEFT: 9,
        HORIZONTAL_PLATFORM_MIDDLE: 10,
        HORIZONTAL_PLATFORM_RIGHT: 11,

        // Vertical platform tiles
        VERTICAL_PLATFORM_TOP: 12,
        VERTICAL_PLATFORM_MIDDLE: 13,
        VERTICAL_PLATFORM_BOTTOM: 14,

        // Platform corner
        PLATFORM_CORNER_TOP_LEFT: 15,
        PLATFORM_CORNER_TOP_RIGHT: 16,
        PLATFORM_CORNER_BOTTOM_LEFT: 17,
        PLATFORM_CORNER_BOTTOM_RIGHT: 18,

        // Inner corner tiles - one corner
        INNER_CORNER_TOP_LEFT: 19,
        INNER_CORNER_TOP_RIGHT: 20,
        INNER_CORNER_BOTTOM_LEFT: 21,
        INNER_CORNER_BOTTOM_RIGHT: 22,

        // Inner corner tiles - two corners
        INNER_CORNERS_TOP: 23,
        INNER_CORNERS_BOTTOM: 24,
        INNER_CORNERS_LEFT: 25,
        INNER_CORNERS_RIGHT: 26,
        INNER_CORNERS_DIAGONAL_ASC: 27, // bottom left and top right
        INNER_CORNERS_DIAGONAL_DESC: 28, // top left and bottom right

        // Inner corner tiles - three corners
        INNER_CORNERS_NO_TOP_LEFT: 29,
        INNER_CORNERS_NO_TOP_RIGHT: 30,
        INNER_CORNERS_NO_BOTTOM_LEFT: 31,
        INNER_CORNERS_NO_BOTTOM_RIGHT: 32,
        
        // Inner Corner Tile - four corners
        INNER_CORNERS_ALL: 33,

        // Surface tiles with corners
        SURFACE_TOP_CORNER_LEFT: 34,
        SURFACE_TOP_CORNERS: 35,
        SURFACE_TOP_CORNER_RIGHT: 36,

        SURFACE_BOTTOM_CORNER_LEFT: 37,
        SURFACE_BOTTOM_CORNERS: 38,
        SURFACE_BOTTOM_CORNER_RIGHT: 39,

        SURFACE_LEFT_CORNER_TOP: 40,
        SURFACE_LEFT_CORNERS: 41,
        SURFACE_LEFT_CORNER_BOTTOM: 42,

        SURFACE_RIGHT_CORNER_TOP: 43,
        SURFACE_RIGHT_CORNERS: 44,
        SURFACE_RIGHT_CORNER_BOTTOM: 45,

        FILLER: 46,
    }

    
    /**
     * @param {Adjacency} adjacent 
     * @returns 
     */
    static getVariant(adjacent) {
        if (!objectHasProperties(adjacent, 
            "top", "bottom", "left", "right", "top_left", 
            "top_right", "bottom_left", "bottom_right")) {
                return null;
        }

        const surface_top = !adjacent.top;
        const surface_bottom = !adjacent.bottom;
        const surface_left = !adjacent.left;
        const surface_right = !adjacent.right;

        const corner_tl = adjacent.top && adjacent.left && !adjacent.top_left;
        const corner_tr = adjacent.top && adjacent.right && !adjacent.top_right;
        const corner_bl = adjacent.bottom && adjacent.left && !adjacent.bottom_left;
        const corner_br = adjacent.bottom && adjacent.right && !adjacent.bottom_right;

        // cursed asfuck, javascript moment
        const surfaceCount = surface_top + surface_bottom + surface_left + surface_right;
        const cornerCount = corner_tl + corner_tr + corner_bl + corner_br;

        //#region 4 surfaces

        if(surfaceCount == 4) {
            return this.variants.SINGLE_TILE;
        }

        //#endregion
        //#region 3 surfaces

        if(surfaceCount == 3) {
            if(!surface_top) return this.variants.VERTICAL_PLATFORM_BOTTOM;
            if(!surface_bottom) return this.variants.VERTICAL_PLATFORM_TOP;
            if(!surface_left) return this.variants.HORIZONTAL_PLATFORM_RIGHT;
            if(!surface_right) return this.variants.HORIZONTAL_PLATFORM_LEFT;
        }

        //#endregion
        //#region 2 surfaces

        if(surfaceCount == 2) {

            // Platform middles
            if(surface_left && surface_right) 
                return this.variants.VERTICAL_PLATFORM_MIDDLE;

            if(surface_top && surface_bottom) 
                return this.variants.HORIZONTAL_PLATFORM_MIDDLE;

            // Corners
            var keywords = ["CORNER"];

            if(surface_top) keywords.push("TOP");
            if(surface_bottom) keywords.push("BOTTOM");
            if(surface_left)keywords.push("LEFT");
            if(surface_right) keywords.push("RIGHT");

            if(cornerCount == 1) keywords.unshift("PLATFORM");

            return this.variants[keywords.join("_")];
        }

        //#endregion
        //#region 1 Surface

        if(surfaceCount == 1) {

            if(surface_top) return (
                cornerCount == 2 ? this.variants.SURFACE_TOP_CORNERS :
                corner_bl ? this.variants.SURFACE_TOP_CORNER_LEFT :
                corner_br ? this.variants.SURFACE_TOP_CORNER_RIGHT :
                this.variants.SURFACE_TOP);

            else if(surface_bottom) return (
                cornerCount == 2 ? this.variants.SURFACE_BOTTOM_CORNERS :
                corner_tl ? this.variants.SURFACE_BOTTOM_CORNER_LEFT :
                corner_tr ? this.variants.SURFACE_BOTTOM_CORNER_RIGHT :
                this.variants.SURFACE_BOTTOM);
    
            else if(surface_left) return (
                cornerCount == 2 ? this.variants.SURFACE_LEFT_CORNERS :
                corner_tr ? this.variants.SURFACE_LEFT_CORNER_TOP :
                corner_br ? this.variants.SURFACE_LEFT_CORNER_BOTTOM :
                this.variants.SURFACE_LEFT);
    
            else if(surface_right) return (
                cornerCount == 2 ? this.variants.SURFACE_RIGHT_CORNERS :
                corner_tl ? this.variants.SURFACE_RIGHT_CORNER_TOP :
                corner_bl ? this.variants.SURFACE_RIGHT_CORNER_BOTTOM :
                this.variants.SURFACE_RIGHT);
        }

        //#endregion
        //#region 4 Inner corners

        if(cornerCount == 4) {
            return this.variants.INNER_CORNERS_ALL;
        }

        //#endregion
        //#region 3 Inner corners

        if(cornerCount == 3) return (
            !corner_tl ? this.variants.INNER_CORNERS_NO_TOP_LEFT :
            !corner_tr ? this.variants.INNER_CORNERS_NO_TOP_RIGHT :
            !corner_bl ? this.variants.INNER_CORNERS_NO_BOTTOM_LEFT :
            this.variants.INNER_CORNERS_NO_BOTTOM_RIGHT);

        //#endregion
        //#region 2 Inner corners

        if(cornerCount == 2) {
            if(corner_tl && corner_tr) return this.variants.INNER_CORNERS_TOP;
            if(corner_bl && corner_br) return this.variants.INNER_CORNERS_BOTTOM;
            if(corner_tl && corner_bl) return this.variants.INNER_CORNERS_LEFT;
            if(corner_tr && corner_br) return this.variants.INNER_CORNERS_RIGHT;
            if(corner_bl && corner_tr) return this.variants.INNER_CORNERS_DIAGONAL_ASC;
            if(corner_tl && corner_br) return this.variants.INNER_CORNERS_DIAGONAL_DESC;
        }

        //#endregion
        //#region 1 Inner corner

        if(cornerCount == 1) {
            if(corner_tl) return this.variants.INNER_CORNER_TOP_LEFT;
            if(corner_tr) return this.variants.INNER_CORNER_TOP_RIGHT;
            if(corner_bl) return this.variants.INNER_CORNER_BOTTOM_LEFT;
            if(corner_br) return this.variants.INNER_CORNER_BOTTOM_RIGHT;
        }

        //#endregion

        if(cornerCount == 0 && surfaceCount == 0) {
            return this.variants.FILLER;
        }

        throw new error("Auto tiling fuckup. This should never happen!");
    }

    /**
     * Get position from adjacency object
     * @overload
     * @param {Adjacency} adjacent
     * @returns {Point}
     */

    /**
     * Get spritesheet position for a tileset variant
     * @overload
     * @param variant use Tileset.variants!!
     * @param {tilesetTemplate} [template]
     * @returns {Point}
     */
    static getSpritesheetPosition(arg, template = null) {

        template ??= Tileset.templates.DEFAULT;

        let variant = arg;
        if(objectHasProperties(arg, "top", "bottom", "left", "right", "top_left", "top_right", "bottom_left", "bottom_right")) {
            variant = Tileset.getVariant(arg);
        }

        return template.getPosition(variant)
    }

    static templates = {

        /**
         * Used for tiles that have no tiling, and only have a single sprite.
         */
        NONE: new TilesetTemplate(),

        /**
         * The standard tileset template, used for most tileable tiles
         */
        DEFAULT: new TilesetTemplate({
            // No adjacent
            [Tileset.variants.SINGLE_TILE]: point(3, 3),

            // Surface tiles
            [Tileset.variants.SURFACE_TOP]: point(1, 0),
            [Tileset.variants.SURFACE_BOTTOM]: point(1, 2),
            [Tileset.variants.SURFACE_LEFT]: point(0, 1),
            [Tileset.variants.SURFACE_RIGHT]: point(2, 1),

            // Outer corner tiles
            [Tileset.variants.CORNER_TOP_LEFT]: point(0, 0),
            [Tileset.variants.CORNER_TOP_RIGHT]: point(2, 0),
            [Tileset.variants.CORNER_BOTTOM_LEFT]: point(0, 2),
            [Tileset.variants.CORNER_BOTTOM_RIGHT]: point(2, 2),

            // Horizontal platform tiles
            [Tileset.variants.HORIZONTAL_PLATFORM_LEFT]: point(0, 3),
            [Tileset.variants.HORIZONTAL_PLATFORM_MIDDLE]: point(1, 3),
            [Tileset.variants.HORIZONTAL_PLATFORM_RIGHT]: point(2, 3),

            // Vertical platform tiles
            [Tileset.variants.VERTICAL_PLATFORM_TOP]: point(3, 0),
            [Tileset.variants.VERTICAL_PLATFORM_MIDDLE]: point(3, 1),
            [Tileset.variants.VERTICAL_PLATFORM_BOTTOM]: point(3, 2),

            // Platform corner
            [Tileset.variants.PLATFORM_CORNER_TOP_LEFT]: point(0, 4),
            [Tileset.variants.PLATFORM_CORNER_TOP_RIGHT]: point(4, 4),
            [Tileset.variants.PLATFORM_CORNER_BOTTOM_LEFT]: point(0, 8),
            [Tileset.variants.PLATFORM_CORNER_BOTTOM_RIGHT]: point(4, 8),

            // Inner corner tiles - one corner
            [Tileset.variants.INNER_CORNER_TOP_LEFT]: point(4, 3),
            [Tileset.variants.INNER_CORNER_TOP_RIGHT]: point(4, 1),
            [Tileset.variants.INNER_CORNER_BOTTOM_LEFT]: point(4, 2),
            [Tileset.variants.INNER_CORNER_BOTTOM_RIGHT]: point(4, 0), 

            // Inner corner tiles - two corners
            [Tileset.variants.INNER_CORNERS_TOP]: point(2, 5),
            [Tileset.variants.INNER_CORNERS_BOTTOM]: point(2, 7),
            [Tileset.variants.INNER_CORNERS_LEFT]: point(1, 6),
            [Tileset.variants.INNER_CORNERS_RIGHT]: point(3, 6),
            [Tileset.variants.INNER_CORNERS_DIAGONAL_ASC]: point(5, 1),
            [Tileset.variants.INNER_CORNERS_DIAGONAL_DESC]: point(5, 0),

            // Inner corner tiles - three corners
            [Tileset.variants.INNER_CORNERS_NO_TOP_LEFT]: point(3, 7),
            [Tileset.variants.INNER_CORNERS_NO_TOP_RIGHT]: point(1, 7),
            [Tileset.variants.INNER_CORNERS_NO_BOTTOM_LEFT]: point(3, 5),
            [Tileset.variants.INNER_CORNERS_NO_BOTTOM_RIGHT]: point(1, 5),
            
            // Inner Corner Tile - four corners
            [Tileset.variants.INNER_CORNERS_ALL]: point(2, 6),

            // Surface tiles with corners
            [Tileset.variants.SURFACE_TOP_CORNER_LEFT]: point(1, 4),
            [Tileset.variants.SURFACE_TOP_CORNERS]: point(2, 4),
            [Tileset.variants.SURFACE_TOP_CORNER_RIGHT]: point(3, 4),

            [Tileset.variants.SURFACE_BOTTOM_CORNER_LEFT]: point(1, 8),
            [Tileset.variants.SURFACE_BOTTOM_CORNERS]: point(2, 8),
            [Tileset.variants.SURFACE_BOTTOM_CORNER_RIGHT]: point(3, 8),

            [Tileset.variants.SURFACE_LEFT_CORNER_TOP]: point(0, 5),
            [Tileset.variants.SURFACE_LEFT_CORNERS]: point(0, 6),
            [Tileset.variants.SURFACE_LEFT_CORNER_BOTTOM]: point(0, 7),

            [Tileset.variants.SURFACE_RIGHT_CORNER_TOP]: point(4, 5),
            [Tileset.variants.SURFACE_RIGHT_CORNERS]: point(4, 6),
            [Tileset.variants.SURFACE_RIGHT_CORNER_BOTTOM]: point(4, 7),

            [Tileset.variants.FILLER]: point(1, 1),
        }),

        /**
         * Used for tiles which cannot have a tile above them (ex. Grass)
         */
        NO_TILE_ABOVE: new TilesetTemplate({
            // No adjacent
            [Tileset.variants.SINGLE_TILE]: point(3, 1),
                    
            // Surfaces
            [Tileset.variants.SURFACE_TOP]: point(1, 0),
            [Tileset.variants.SURFACE_TOP_CORNER_LEFT]: point(1, 2),
            [Tileset.variants.SURFACE_TOP_CORNERS]: point(2, 2),
            [Tileset.variants.SURFACE_TOP_CORNER_RIGHT]: point(3, 2),

            // Corners
            [Tileset.variants.CORNER_TOP_LEFT]: point(0, 0), 
            [Tileset.variants.CORNER_TOP_RIGHT]: point(2, 0),
            [Tileset.variants.PLATFORM_CORNER_TOP_LEFT]: point(0, 2),
            [Tileset.variants.PLATFORM_CORNER_TOP_RIGHT]: point(4, 2),

            // Platforms
            [Tileset.variants.HORIZONTAL_PLATFORM_LEFT]: point(0, 1),
            [Tileset.variants.HORIZONTAL_PLATFORM_MIDDLE]: point(1, 1),
            [Tileset.variants.HORIZONTAL_PLATFORM_RIGHT]: point(2, 1),
            [Tileset.variants.VERTICAL_PLATFORM_TOP]: point(3, 0),
        })
    }
}