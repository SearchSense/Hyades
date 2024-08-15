import { DataPoint } from "../../clustering/datapoint.mjs";

/** @type {Map<symbol, CanvasDataPoint>} The global canvas data point cache. */
const _global_datapoint_cache = new Map();

/** @type {Map<symbol, Array<CanvasDataPoint>>} The global neighbours cache. */
const _global_neighbours_cache = new Map()

/**
 * Extend DataPoint class to use with the canvas.
 */
export class CanvasDataPoint extends DataPoint {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates - X and Y coordinates of the data point.
     */
    constructor(coordinates) {
        super(coordinates);
        if (new.target === CanvasDataPoint) {
            if (_global_datapoint_cache.has(this.symbol)) {
                return _global_datapoint_cache.get(this.symbol);
            } else {
                _global_datapoint_cache.set(this.symbol, this);
            }
        }
    }

    /**
     * Get a list of neighbouring data points.
     * @returns {Array<CanvasDataPoint>} The list of neighbouring data points.
     */
    getNeighbours() {
        if (_global_neighbours_cache.has(this.symbol)) {
            return _global_neighbours_cache.get(this.symbol);
        }

        const _tmp_neighbours = [
            new CanvasDataPoint([this.x + 1, this.y]),
            new CanvasDataPoint([this.x - 1, this.y]),
            new CanvasDataPoint([this.x, this.y + 1]),
            new CanvasDataPoint([this.x, this.y - 1]),
            new CanvasDataPoint([this.x + 1, this.y + 1]),
            new CanvasDataPoint([this.x + 1, this.y - 1]),
            new CanvasDataPoint([this.x - 1, this.y + 1]),
            new CanvasDataPoint([this.x - 1, this.y - 1]),
        ]

        _global_neighbours_cache.set(this.symbol, _tmp_neighbours);
        return _tmp_neighbours;
    }
}
