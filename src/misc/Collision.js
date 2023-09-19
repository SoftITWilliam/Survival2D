
export class Collision {

    /**
     * @typedef {Object} Rectangle
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */
    /**
     * @typedef {Object} Entity
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     * @property {number} dx
     * @property {number} dy
     */

    /**
     * Returns true if the two rectangles overlap with each other
     * @param {Rectangle} rect1 
     * @param {Rectangle} rect2 
     * @returns {boolean}
     */
    static rectangleOverlap(rect1, rect2) {
        return (rect1.x < rect2.x +rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y);
    }

    /**
     * @param {Entity} entity 
     * @param {Rectangle} rect 
     * @returns {boolean}
     */
    static topSurface(entity, rect) {
        return (entity.dy >= 0 &&
                entity.x + entity.width > rect.x + 1 &&
                entity.x < rect.x + rect.width - 1 &&
                entity.y + entity.height + entity.dy >= rect.y &&
                entity.y + entity.height <= rect.y + entity.dy + 1);
    }

    /**
     * @param {Entity} entity 
     * @param {Rectangle} rect 
     * @returns {boolean}
     */
    static bottomSurface(entity, rect) {
        return (entity.dy <= 0 &&
                entity.x + entity.width > rect.x &&
                entity.x < rect.x + rect.width &&
                entity.y <= rect.y + rect.height &&
                entity.y >= rect.y + rect.height + entity.dy - 1);
    }

    /**
     * @param {Entity} entity 
     * @param {Rectangle} rect 
     * @returns {boolean}
     */
    static leftSurface(entity, rect) {
        return (entity.dx >= 0 &&
                entity.x + entity.dx + entity.width > rect.x &&
                entity.x + entity.dx + entity.width <= rect.x + entity.dx + 1 &&
                entity.y + entity.height > rect.y &&
                entity.y < rect.y + rect.height);
    }

    /**
     * @param {Entity} entity 
     * @param {Rectangle} rect 
     * @returns {boolean}
     */
    static rightSurface(entity, rect) {
        return (entity.dx <= 0 &&
                entity.x + entity.dx < rect.x + rect.width &&
                entity.x + entity.dx >= rect.x + rect.width + entity.dx - 1 &&
                entity.y + entity.height > rect.y &&
                entity.y < rect.y + rect.height);
    }
}