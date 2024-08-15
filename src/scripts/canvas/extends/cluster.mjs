import { throttle } from "../../common/debounce/debounce.mjs";
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
     * @param {Array<number> | DataPoint | number} coordinates - X and Y coordinates of the centroid of the cluster.
     */
    constructor(coordinates) {
        super(coordinates);

        /** @type {number} Color of the cluster. */
        this._pvt_color = Math.round(random(0x202020FF, 0xDFDFDFFF));

        /** @type {string} The color of the cluster. */
        this.color = `#${this._pvt_color.toString(16).padStart(8, '0').slice(0, 6)}`;

        /** @type {Array<CanvasDataPoint>} The active boundary of the cluster. */
        this._active_boundary = [new CanvasDataPoint(this)];

        /** @type {Array<CanvasDataPoint>} The new boundary of the cluster. */
        this._new_boundary = [];

        this.addEventListener("cluster:add", event => {
            const _tmp_datapoint = event?.detail?.dataPoint;
            if (_tmp_datapoint) {
                this._active_boundary.push(new CanvasDataPoint(_tmp_datapoint));
            }
        });
    }

    /**
     * Expand the cluster boundary.
     * @param {Array<CanvasCluster>} others - The list of other clusters.
     * @param {ImageBitmap} regionMap - The region map.
     * @param {Map<number, CanvasCluster>} colorMap - The temporary color-cluster map.
     */
    grow(others, regionMap, colorMap) {
        /** @type {number} The number of data points to process in a batch. */
        const _tmp_batch_size = HyadesConfig.Animation.BatchSize;

        if (this._active_boundary.length === 0) {
            if (this._new_boundary.length === 0)
                return;

            this._active_boundary = this._new_boundary;
            this._new_boundary = [];
        }

        /** @type {Array<CanvasDataPoint>} The data points to process in this batch. */
        const _tmp_border = this._active_boundary.splice(0, _tmp_batch_size);
        /** @type {Uint32Array} The region map data. */
        const _tmp_regionMap = new Uint32Array(regionMap.data.buffer);
        /** @type {number} The width of the region map. */
        const _tmp_width = regionMap.width;

        for (const datapoint of _tmp_border) {
            const _dp_x = datapoint.x;
            const _dp_y = datapoint.y;

            const _dp_index = Math.round(_dp_y * _tmp_width + _dp_x);
            if (_dp_index < 0 || _dp_index >= _tmp_regionMap.length)
                continue;
            const _dp_color = _tmp_regionMap[_dp_index];

            if (_dp_color === 0) {
                _tmp_regionMap[_dp_index] = this._pvt_color;
            } else if (_dp_color !== this._pvt_color) {
                const _tmp_result = HyadesConfig.Clustering.Algorithm(datapoint, others, 1);
                const _dp_cluster = _tmp_result[0].cluster;

                if (_dp_cluster._pvt_color === this._pvt_color) {
                    _tmp_regionMap[_dp_index] = this._pvt_color;

                    const _other_cluster = colorMap.get(_dp_color);
                    _other_cluster._new_boundary.push(...datapoint.getNeighbours());

                    const _dp_freq = _other_cluster.get_dp_freq(datapoint);
                    if (_dp_freq > 0) {
                        _other_cluster.remove(datapoint, _dp_freq);
                        this.add(datapoint, _dp_freq);
                    }
                } else {
                    continue;
                }
            }

            /** @type {boolean} Flag to hold the current data point in the boundary. */
            let _flag_hold = false;

            for (const neighbour of datapoint.getNeighbours()) {
                const _ng_x = neighbour.x;
                const _ng_y = neighbour.y;

                if (_ng_x < 0 || _ng_x >= regionMap.width ||
                    _ng_y < 0 || _ng_y >= regionMap.height)
                    continue;

                const _ng_index = Math.round(_ng_y * _tmp_width + _ng_x);
                if (_ng_index < 0 || _ng_index >= _tmp_regionMap.length)
                    continue;
                const _ng_color = _tmp_regionMap[_ng_index];

                if (_ng_color === this._pvt_color) {
                    continue
                } else if (_ng_color === 0) {
                    _tmp_regionMap[_ng_index] = this._pvt_color;
                    this._new_boundary.push(neighbour);
                    continue;
                }

                const _tmp_result = HyadesConfig.Clustering.Algorithm(neighbour, others, 1);
                const _ng_cluster = _tmp_result[0].cluster;

                if (_ng_cluster._pvt_color === this._pvt_color) {
                    _tmp_regionMap[_ng_index] = this._pvt_color;
                    this._new_boundary.push(neighbour);

                    const _other_cluster = colorMap.get(_ng_color);
                    _other_cluster._new_boundary.push(...neighbour.getNeighbours());

                    const _dp_freq = _other_cluster.get_dp_freq(neighbour);
                    if (_dp_freq > 0) {
                        _other_cluster.remove(neighbour, _dp_freq);
                        this.add(neighbour, _dp_freq);
                    }
                } else {
                    _flag_hold = true;
                }
            } // for (const neighbour of datapoint.getNeighbours())

            if (_flag_hold) {
                this._new_boundary.push(datapoint);
            }
        } // for (const datapoint of _tmp_border)
    }
}
