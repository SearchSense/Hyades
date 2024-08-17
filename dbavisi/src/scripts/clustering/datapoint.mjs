export class DataPoint extends EventTarget {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates - X and Y coordinates of the data point.
     */
    constructor(coordinates) {
        super();

        /** @type {number} X-coordinate of the data point. */
        let _tmp_x
        /** @type {number} Y-coordinate of the data point. */
        let _tmp_y;

        if (coordinates instanceof DataPoint) {
            _tmp_x = coordinates.x;
            _tmp_y = coordinates.y;
        } else if (typeof coordinates === "number") {
            if (isNaN(coordinates) || !isFinite(coordinates)) {
                throw new Error("Invalid coordinates");
            }

            _tmp_x = coordinates;
            _tmp_y = coordinates;
        } else {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            _tmp_x = Number(coordinates[0]);
            if (isNaN(_tmp_x) || !isFinite(_tmp_x)) {
                throw new Error("Invalid X coordinate");
            }
            _tmp_y = Number(coordinates[1]);
            if (isNaN(_tmp_y) || !isFinite(_tmp_y)) {
                throw new Error("Invalid Y coordinate");
            }
        }

        /** @type {number} X-coordinate of the data point. */
        this._pvt_x = _tmp_x;
        /** @type {number} Y-coordinate of the data point. */
        this._pvt_y = _tmp_y;

        /** @type {Symbol} The unique symbol for the coordinate. */
        this._pvt_symbol = null;
    }

    /** X-coordinate of the data point. */
    get x() {
        return this._pvt_x;
    }

    /** Y-coordinate of the data point. */
    get y() {
        return this._pvt_y;
    }

    /** The unique symbol for the coordinate. */
    get symbol() {
        if (!this._pvt_symbol) {
            this._pvt_symbol = Symbol.for(`${this._pvt_x}_${this._pvt_y}`);
        }
        return this._pvt_symbol;
    }

    /**
     * Set the new coordinates of the data point.
     * @param {Array<number> | DataPoint | number} coordinates - New X and Y coordinates of the data point.
     * @returns {DataPoint} The current instance.
     */
    jumpTo(coordinates) {
        /** @type {number} New X-coordinate of the data point. */
        let _tmp_x;
        /** @type {number} New Y-coordinate of the data point. */
        let _tmp_y;

        if (coordinates instanceof DataPoint) {
            _tmp_x = coordinates.x;
            _tmp_y = coordinates.y;
        } else if (typeof coordinates === "number") {
            if (isNaN(coordinates) || !isFinite(coordinates)) {
                throw new Error("Invalid coordinates");
            }

            _tmp_x = coordinates;
            _tmp_y = coordinates;
        } else {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            _tmp_x = Number(coordinates[0]);
            if (isNaN(_tmp_x) || !isFinite(_tmp_x)) {
                throw new Error("Invalid X coordinate");
            }
            _tmp_y = Number(coordinates[1]);
            if (isNaN(_tmp_y) || !isFinite(_tmp_y)) {
                throw new Error("Invalid Y coordinate");
            }
        }

        this._pvt_x = _tmp_x;
        this._pvt_y = _tmp_y;
        this._pvt_symbol = null;

        this.dispatchEvent(new Event("datapoint:jump"));

        return this;
    }

    /**
     * Move the data point by a certain amount.
     * @param {Array<number> | DataPoint | number} delta - Change in X and Y coordinates.
     * @param {number} count - Number of times to move the data point.
     * @returns {DataPoint} The current instance.
     */
    moveBy(delta, count = 1) {
        /** @type {number} Change in X-coordinate. */
        let _tmp_x;
        /** @type {number} Change in Y-coordinate. */
        let _tmp_y;

        /** @type {number} Number of times to move the data point. */
        let _tmp_count;

        if (delta instanceof DataPoint) {
            _tmp_x = delta.x;
            _tmp_y = delta.y;
        } else if (typeof delta === "number") {
            if (isNaN(delta) || !isFinite(delta)) {
                throw new Error("Invalid delta");
            }

            _tmp_x = delta;
            _tmp_y = delta;
        } else {
            if (!Array.isArray(delta) || delta.length !== 2) {
                throw new Error("Invalid delta");
            }

            _tmp_x = Number(delta[0]);
            if (isNaN(_tmp_x) || !isFinite(_tmp_x)) {
                throw new Error("Invalid X delta");
            }
            _tmp_y = Number(delta[1]);
            if (isNaN(_tmp_y) || !isFinite(_tmp_y)) {
                throw new Error("Invalid Y delta");
            }
        }

        _tmp_count = Number(count);
        if (isNaN(_tmp_count) || !isFinite(_tmp_count)) {
            throw new Error("Invalid count");
        }

        this._pvt_x += _tmp_count * _tmp_x;
        this._pvt_y += _tmp_count * _tmp_y;
        this._pvt_symbol = null;

        this.dispatchEvent(new Event("datapoint:move"));

        return this;
    }

    /**
     * Scale the data point by a certain amount.
     * @param {Array<number> | DataPoint | number} factor - X and Y scaling factors.
     * @returns {DataPoint} The current instance.
     */
    scaleBy(factor) {
        /** @type {number} X-coordinate scaling factor. */
        let _tmp_x;
        /** @type {number} Y-coordinate scaling factor. */
        let _tmp_y;

        if (factor instanceof DataPoint) {
            _tmp_x = factor.x;
            _tmp_y = factor.y;
        } else if (typeof factor === "number") {
            if (isNaN(factor) || !isFinite(factor)) {
                throw new Error("Invalid factor");
            }

            _tmp_x = factor;
            _tmp_y = factor;
        } else {
            if (!Array.isArray(factor) || factor.length !== 2) {
                throw new Error("Invalid factor");
            }

            _tmp_x = Number(factor[0]);
            if (isNaN(_tmp_x) || !isFinite(_tmp_x)) {
                throw new Error("Invalid X factor");
            }
            _tmp_y = Number(factor[1]);
            if (isNaN(_tmp_y) || !isFinite(_tmp_y)) {
                throw new Error("Invalid Y factor");
            }
        }

        this._pvt_x *= _tmp_x;
        this._pvt_y *= _tmp_y;
        this._pvt_symbol = null;

        this.dispatchEvent(new Event("datapoint:scale"));

        return this;
    }

    /**
     * Get the Euclidean distance between two data points.
     * @param {Array<number> | DataPoint} other - The other data point.
     * @returns {number} The Euclidean distance between two data points.
     */
    euclideanDistance(other) {
        /** @type {number} X-coordinate of the other data point. */
        let _tmp_x;
        /** @type {number} Y-coordinate of the other data point. */
        let _tmp_y;

        if (other instanceof DataPoint) {
            _tmp_x = other.x;
            _tmp_y = other.y;
        } else {
            if (!Array.isArray(other) || other.length !== 2) {
                throw new Error("Invalid coordinates");
            }

            _tmp_x = Number(other[0]);
            if (isNaN(_tmp_x) || !isFinite(_tmp_x)) {
                throw new Error("Invalid X coordinate");
            }
            _tmp_y = Number(other[1]);
            if (isNaN(_tmp_y) || !isFinite(_tmp_y)) {
                throw new Error("Invalid Y coordinate");
            }
        }

        return Math.sqrt(
            Math.pow(this._pvt_x - _tmp_x, 2) +
            Math.pow(this._pvt_y - _tmp_y, 2)
        );
    }

    /**
     * Euclidean distance of current data point to multiple data points.
     * @param {Array<Array<number> | DataPoint>} others - The other data points.
     * @returns {Array<number>} The Euclidean distances.
     */
    euclideanDistances(others) {
        return others.map(this.euclideanDistance.bind(this));
    }
}
