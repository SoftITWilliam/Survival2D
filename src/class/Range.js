
/**
 * @param {number} from 
 * @param {number} to 
 * @returns 
 */
export function Range(from, to) {
    return {
        /** @yields {number} */
        *[Symbol.iterator]() {
            for(let i = from; i < to; i++) {
                yield i;
            }
        }
    }
}