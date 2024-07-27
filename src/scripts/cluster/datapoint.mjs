import CONFIG from "../common/config.mjs";

/**
 * A data point in the space.
 */
export class DataPoint {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint} coordinates
     */
    constructor(coordinates) {
        /** @type {Array<number>} */
        let _coordinates;

        if (coordinates instanceof DataPoint) {
            _coordinates = coordinates.coords;
        } else {
            if (!Array.isArray(coordinates)) {
                throw new Error("Invalid coordinates");
            }
            _coordinates = coordinates;
        }

        /** @type {number} Dimension of the data point */
        this.dim = _coordinates.length;

        /** @type {CONFIG.datapoint_coords_t} Coordinates of the data point */
        this.coords = new CONFIG.datapoint_coords_t(this.dim);

        this.coords.set(_coordinates);
    }

    /**
     * Set the new coordinates of the data point.
     * @param {Array<number> | DataPoint} coordinates
     */
    jumpTo(coordinates) {
        /** @type {Array<number>} */
        let _coordinates;

        if (coordinates instanceof DataPoint) {
            _coordinates = coordinates.coords;
        } else {
            if (!Array.isArray(coordinates)) {
                throw new Error("Invalid coordinates");
            }
            _coordinates = coordinates;
        }

        if (_coordinates.length !== this.dim) {
            throw new Error("Dimension mismatch");
        }

        this.coords.set(_coordinates);
    }

    /**
     * Move the data point by a certain amount.
     * @param {Array<number> | DataPoint} delta
     */
    moveBy(delta) {
        /** @type {Array<number>} */
        let _delta;

        if (delta instanceof DataPoint) {
            _delta = delta.coords;
        } else {
            if (!Array.isArray(delta)) {
                throw new Error("Invalid coordinates");
            }
            _delta = delta;
        }

        if (_delta.length !== this.dim) {
            throw new Error("Dimension mismatch");
        }

        _delta.forEach((d, i) => this.coords[i] += d);
    }

    /**
     * Scale the data point by a certain factor.
     * @param {number} factor
     */
    scaleBy(factor) {
        this.coords.forEach((_coord, i) => this.coords[i] *= factor);
    }

    /**
     * Euclidean distance between two data points in the space.
     * @param {Array<number> | DataPoint} other
     * @returns {number} Euclidean distance between two data points.
     */
    euclideanDistance(other) {
        /** @type {Array<number>} */
        let _other;

        if (other instanceof DataPoint) {
            _other = other.coords;
        } else {
            if (!Array.isArray(other)) {
                throw new Error("Invalid coordinates");
            }
            _other = other;
        }

        if (_other.length !== this.dim) {
            throw new Error("Dimension mismatch");
        }

        return Math.sqrt(
            this.coords.reduce(
                (acc, coord, i) => acc + Math.pow(coord - _other[i], 2),
                0)
        );
    }

    /**
     * Get neighbouring coordinates of the data point.
     */
    getNeighbours() {
        const [x, y] = this.coords;

        return [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x + 1, y + 1],
        ].map(neighbour => new DataPoint(neighbour));
    }
}
