import { DataPoint } from "../../clustering/datapoint.mjs";

/**
 * Extend DataPoint class to use with the canvas.
 */
export class CanvasDataPoint extends DataPoint {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates
     */
    constructor(coordinates) {
        super(coordinates);
    }

    /**
     * Get a list of neighbouring data points.
     * @returns {Array<CanvasDataPoint>} The list of neighbouring data points.
     */
    getNeighbours() {
        return [
            new CanvasDataPoint([this.x + 1, this.y]),
            new CanvasDataPoint([this.x - 1, this.y]),
            new CanvasDataPoint([this.x, this.y + 1]),
            new CanvasDataPoint([this.x, this.y - 1]),
            new CanvasDataPoint([this.x + 1, this.y + 1]),
            new CanvasDataPoint([this.x + 1, this.y - 1]),
            new CanvasDataPoint([this.x - 1, this.y + 1]),
            new CanvasDataPoint([this.x - 1, this.y - 1]),
        ]
    }
}
