/**
 * Generate a random number.
 * @param {number} min
 * @param {number} max
 * @returns {number} A random number.
 */
export function random(min = -100, max = 100) {
    return Math.random() * (max - min) + min;
}
