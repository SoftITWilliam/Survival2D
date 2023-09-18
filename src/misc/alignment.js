
export const AlignmentX = {
    LEFT: "left",
    MIDDLE: "middle",
    RIGHT: "right",
}

export const AlignmentY = {
    TOP: "top",
    MIDDLE: "middle",
    BOTTOM: "bottom",
}

/**
 * @overload
 * @param {number} objectX 
 * @param {number} objectWidth 
 * @param {number} alignToWidth 
 * @param alignment use AlignmentX enum!!
 */
/**
 * @overload
 * @param {number} x 
 * @param {number} width 
 * @param alignment use AlignmentX enum!!
 */
export function getAlignedX(arg1, arg2, arg3, arg4) {

    var alignFromPoint = (x, width, alignment) => {
        switch(alignment) {
            case AlignmentX.MIDDLE: return x - (width / 2);
            case AlignmentX.RIGHT: return x - width;
            default: return x;
        }
    }

    var alignFromDifference = (objectX, objectWidth, alignToWidth, alignment) => {
        let widthDifference = alignToWidth - objectWidth;

        switch(alignment) {
            case AlignmentX.MIDDLE: return objectX - (widthDifference / 2);
            case AlignmentX.RIGHT: return objectX - widthDifference;
            default: return objectX;
        }
    }

    if(arg1 != null && arg2 != null && arg3 != null) {
        if(arg4 == null) {
            return alignFromPoint(arg1, arg2, arg3);
        }
        else {
            return alignFromDifference(arg1, arg2, arg3, arg4);
        }
    }
    else return arg1;
}

/**
 * @overload
 * @param {number} objectY 
 * @param {number} objectHeight
 * @param {number} alignToHeight 
 * @param alignment use AlignmentY enum!!
 */
/**
 * @overload
 * @param {number} y 
 * @param {number} height 
 * @param alignment use AlignmentY enum!!
 */
export function getAlignedY(arg1, arg2, arg3, arg4) {

    var alignFromPoint = (y, height, alignment) => {
        switch(alignment) {
            case AlignmentY.MIDDLE: return y - (height / 2);
            case AlignmentY.BOTTOM: return y - height;
            default: return y;
        }
    }

    var alignFromDifference = (objectY, objectHeight, alignToHeight, alignment) => {
        let heightDifference = alignToHeight - objectHeight;

        switch(alignment) {
            case AlignmentY.MIDDLE: return objectY - (heightDifference / 2);
            case AlignmentY.BOTTOM: return objectY - heightDifference;
            default: return objectY;
        }
    }

    if(arg1 != null && arg2 != null && arg3 != null) {
        if(arg4 == null) {
            return alignFromPoint(arg1, arg2, arg3);
        }
        else {
            return alignFromDifference(arg1, arg2, arg3, arg4);
        }
    }
    else return arg1;
}