/**
 * Generate a random number.
 * @param {number} min
 * @param {number} max
 * @returns {number} A random number.
 */
export function random(min = -100, max = 100) {
    return Math.random() * (max - min) + min;
}


export class Deque{
    /**
     * Create a new deque.
     */
    constructor() {
        this.items = [];
        this.front = 0;
        this.back = 0;
        this.length = 0;
    }

    /**
     * Add an element to the deque.
     * @param {any} element - The element to add.
     */
    add(element) {
        this.items[this.back] = element;
        this.back++;
        this.length++;
    }

    /**
     * Remove an element from the deque.
     * @returns {any} The removed element.
     * @returns {null} If the deque is empty.
     */
    remove() {
        if (this.is_empty()) {
            return null;
        }
        const removedElement = this.items[this.front];
        this.front++;
        this.length--;
        if(this.front > 3000){
            this.clear_cache();
        }
        return removedElement;
    }

    /**
     * Check if the deque is empty.
     * @returns {boolean} True if the deque is empty, false otherwise.
     */
    is_empty(){
        return this.front === this.back;
    }

    /**
     * clear the deque.
     */
    clear(){
        this.items = [];
        this.front = 0;
        this.back = 0;
        this.length = 0;
    }

    /**
     * Clear the cache for memory optimization.
     */
    clear_cache(){
        this.items = this.items.slice(this.front, this.back);
        this.front = 0;
        this.back = this.items.length;
    }
}
