export class DataPoint extends EventTarget {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates
     */
    constructor(coordinates) {
        super();

        /** @type {number} X-coordinate of the data point. */
        let __tmp_x
        /** @type {number} Y-coordinate of the data point. */
        let __tmp_y;

        if (coordinates instanceof DataPoint) {
            __tmp_x = coordinates.x;
            __tmp_y = coordinates.y;
        } else if (typeof coordinates === "number") {
            if (isNaN(coordinates) || !isFinite(coordinates)) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = coordinates;
            __tmp_y = coordinates;
        } else {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = Number(coordinates[0]);
            __tmp_y = Number(coordinates[1]);
        }

        /** @type {number} X-coordinate of the data point. */
        this.__pvt_x = __tmp_x;
        /** @type {number} Y-coordinate of the data point. */
        this.__pvt_y = __tmp_y;
    }

    /** X-coordinate of the data point. */
    get x() {
        return this.__pvt_x;
    }

    /** Y-coordinate of the data point. */
    get y() {
        return this.__pvt_y;
    }

    /**
     * Set the new coordinates of the data point.
     * @param {Array<number> | DataPoint | number} coordinates
     * @returns {DataPoint} The current instance.
     */
    jumpTo(coordinates) {
        /** @type {number} New X-coordinate of the data point. */
        let __tmp_x;
        /** @type {number} New Y-coordinate of the data point. */
        let __tmp_y;

        if (coordinates instanceof DataPoint) {
            __tmp_x = coordinates.x;
            __tmp_y = coordinates.y;
        } else if (typeof coordinates === "number") {
            if (isNaN(coordinates) || !isFinite(coordinates)) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = coordinates;
            __tmp_y = coordinates;
        } else {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = Number(coordinates[0]);
            __tmp_y = Number(coordinates[1]);
        }

        this.__pvt_x = __tmp_x;
        this.__pvt_y = __tmp_y;

        return this;
    }

    /**
     * Move the data point by a certain amount.
     * @param {Array<number> | DataPoint | number} delta
     * @returns {DataPoint} The current instance.
     */
    moveBy(delta) {
        /** @type {number} Change in X-coordinate. */
        let __tmp_x;
        /** @type {number} Change in Y-coordinate. */
        let __tmp_y;

        if (delta instanceof DataPoint) {
            __tmp_x = delta.x;
            __tmp_y = delta.y;
        } else if (typeof delta === "number") {
            if (isNaN(delta) || !isFinite(delta)) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = delta;
            __tmp_y = delta;
        } else {
            if (!Array.isArray(delta) || delta.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = Number(delta[0]);
            __tmp_y = Number(delta[1]);
        }

        this.__pvt_x += __tmp_x;
        this.__pvt_y += __tmp_y;

        return this;
    }

    /**
     * Scale the data point by a certain amount.
     * @param {Array<number> | DataPoint | number} factor
     * @returns {DataPoint} The current instance.
     */
    scaleBy(factor) {
        /** @type {number} X-coordinate scaling factor. */
        let __tmp_x;
        /** @type {number} Y-coordinate scaling factor. */
        let __tmp_y;

        if (factor instanceof DataPoint) {
            __tmp_x = factor.x;
            __tmp_y = factor.y;
        } else if (typeof factor === "number") {
            if (isNaN(factor) || !isFinite(factor)) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = factor;
            __tmp_y = factor;
        } else {
            if (!Array.isArray(factor) || factor.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = Number(factor[0]);
            __tmp_y = Number(factor[1]);
        }

        this.__pvt_x *= __tmp_x;
        this.__pvt_y *= __tmp_y;

        return this;
    }

    /**
     * Get the Euclidean distance between two data points.
     * @param {Array<number> | DataPoint} other
     * @returns {number} The Euclidean distance between two data points.
     */
    euclideanDistance(other) {
        /** @type {number} X-coordinate of the other data point. */
        let __tmp_x;
        /** @type {number} Y-coordinate of the other data point. */
        let __tmp_y;

        if (other instanceof DataPoint) {
            __tmp_x = other.x;
            __tmp_y = other.y;
        } else {
            if (!Array.isArray(other) || other.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            __tmp_x = Number(other[0]);
            __tmp_y = Number(other[1]);
        }

        return Math.sqrt(
            Math.pow(this.__pvt_x - __tmp_x, 2) +
            Math.pow(this.__pvt_y - __tmp_y, 2)
        );
    }

    /**
     * Euclidean distance of current data point to multiple data points.
     * @param {Array<Array<number> | DataPoint>} others
     * @returns {Array<number>} The Euclidean distances.
     */
    euclideanDistances(others) {
        return others.map(other => this.euclideanDistance(other));
    }
}
