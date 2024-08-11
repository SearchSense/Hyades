import { random } from "../../common/util.mjs";
import { HyadesConfig } from "../../common/config.mjs";
import { Cluster } from "../../clustering/cluster.mjs";
import { CanvasDataPoint } from "./datapoint.mjs";

/**
 * Extend Cluster class to use with the canvas.
 */
export class CanvasCluster extends Cluster {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates
     */
    constructor(coordinates) {
        super(coordinates);

        /** @type {number} Color of the cluster. */
        this.__pvt_color = Math.round(random(0x202020FF, 0xDFDFDFFF));

        /** @type {string} The color of the cluster. */
        this.color = `#${this.__pvt_color.toString(16).padStart(8, '0').slice(0, 6)}`;

        /** @type {Array<CavnasDataPoint>} The active boundary of the cluster. */
        this.__active_boundary = [new CanvasDataPoint(this)];

        /** @type {Array<CavnasDataPoint>} The new boundary of the cluster. */
        this.__new_boundary = [];
    }

    /**
     * Expand the cluster boundary.
     * @param {Array<CanvasCluster>} others - The list of other clusters.
     * @param {ImageBitmap} regionMap - The region map.
     */
    grow(others, regionMap) {
        /** @type {number} The number of data points to process in a batch. */
        const __tmp_batch_size = HyadesConfig.Animation.BatchSize;

        if (this.__active_boundary.length === 0) {
            if (this.__new_boundary.length === 0)
                return;

            this.__active_boundary = this.__new_boundary;
            this.__new_boundary = [];
        }

        const __tmp_border = this.__active_boundary.splice(0, __tmp_batch_size);
        const __tmp_regionMap = new Uint32Array(regionMap.data.buffer);
        const __tmp_width = regionMap.width;

        for (const datapoint of __tmp_border) {
            for (const neighbour of datapoint.getNeighbours()) {
                const __ng_x = neighbour.x;
                const __ng_y = neighbour.y;

                if (__ng_x < 0 || __ng_x >= regionMap.width ||
                    __ng_y < 0 || __ng_y >= regionMap.height)
                    continue;

                const __ng_index = Math.round(__ng_y * __tmp_width + __ng_x);
                const __ng_color = __tmp_regionMap[__ng_index];

                if (__ng_color === this.__pvt_color) {
                    continue
                } else if (__ng_color === 0) {
                    __tmp_regionMap[__ng_index] = this.__pvt_color;
                    this.__new_boundary.push(neighbour);
                    continue;
                }

                const __tmp_result = HyadesConfig.Clustering.Algorithm(neighbour, others, 1);
                const __ng_cluster = __tmp_result[0].cluster;

                if (__ng_cluster.__pvt_color === this.__pvt_color) {
                    __tmp_regionMap[__ng_index] = this.__pvt_color;
                    this.__new_boundary.push(neighbour);
                }
            } // for (const neighbour of datapoint.getNeighbours())
        } // for (const datapoint of __tmp_border)
    }
}
