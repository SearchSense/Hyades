import { DataPoint } from "./datapoint.mjs";

export class Cluster extends DataPoint {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates - X and Y coordinates of the centroid of the cluster.
     */
    constructor(coordinates) {
        super(coordinates);

        /** @type {number} The total number of members in the cluster. */
        this._pvt_members = 0;

        /** @type {DataPoint} The aggregate of the cluster. */
        this._cache_aggregate = new DataPoint(0);

        /** @type {Map<symbol, number>} The frequency of data points in the cluster. */
        this._pvt_dp_freq = new Map();
    }

    /** The total number of members in the cluster. */
    get members() {
        return this._pvt_members;
    }

    /**
     * Get the frequency of a data point in the cluster.
     * @param {Array<number> | DataPoint} coordinate - X and Y coordinates of the data point.
     * @returns {number} The frequency of the data point.
     */
    get_dp_freq(coordinate) {
        if (!(coordinate instanceof DataPoint))
            coordinate = new DataPoint(coordinate);

        /** @type {symbol} The key of the data point. */
        const _tmp_key = coordinate.symbol;

        if (this._pvt_dp_freq.has(_tmp_key)) {
            return this._pvt_dp_freq.get(_tmp_key);
        } else {
            return 0;
        }
    }

    /**
     * Increment the frequency of a data point in the cluster.
     * @param {Array<number> | DataPoint} coordinate - X and Y coordinates of the data point.
     * @param {number} count - Frequency to increment.
     */
    inc_dp_freq(dataPoint, count) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        /** @type {symbol} The key of the data point. */
        const _tmp_key = dataPoint.symbol;

        /** @type {number} The frequency of the data point. */
        const _tmp_count = Number(count);
        if (isNaN(_tmp_count) || !isFinite(_tmp_count)) {
            throw new Error("Invalid count");
        }

        if (this._pvt_dp_freq.has(_tmp_key)) {
            /** @type {number} The frequency of the data point. */
            const _tmp_freq = this._pvt_dp_freq.get(_tmp_key);
            /** @type {number} The new frequency of the data point. */
            const _tmp_freq_new = _tmp_freq + _tmp_count;

            if (_tmp_freq_new < 0) {
                throw new Error("Decreasing frequency below zero");
            }
            this._pvt_dp_freq.set(_tmp_key, _tmp_freq_new);
        } else {
            if (_tmp_count < 0) {
                throw new Error("Setting frequency below zero");
            }
            this._pvt_dp_freq.set(_tmp_key, _tmp_count);
        }

        this._pvt_members += count;
    }

    /**
     * Add a data point to the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to add.
     * @param {number} count - Frequency of the data point.
     * @returns {DataPoint} The new DataPoint instance.
    */
    add(dataPoint, count = 1) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        /** @type {number} The frequency of the data point. */
        const _tmp_count = Number(count);
        if (isNaN(_tmp_count) || !isFinite(_tmp_count)) {
            throw new Error("Invalid count");
        }

        this.inc_dp_freq(dataPoint, _tmp_count);
        this._cache_aggregate.moveBy(dataPoint, _tmp_count);
        this.jumpTo(this._cache_aggregate).scaleBy(1 / this._pvt_members);

        this.dispatchEvent(new Event("cluster:shift"));

        return dataPoint;
    }

    /**
     * Remove a data point from the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to remove.
     * @param {number} count - Frequency of the data point.
     * @returns {Cluster} The current instance.
     */
    remove(dataPoint, count = 1) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        /** @type {number} The frequency of the data point. */
        const _tmp_count = -1 * Number(count);
        if (isNaN(_tmp_count) || !isFinite(_tmp_count)) {
            throw new Error("Invalid count");
        }

        this.inc_dp_freq(dataPoint, _tmp_count);
        this._cache_aggregate.moveBy(dataPoint, _tmp_count);
        this.jumpTo(this._cache_aggregate).scaleBy(1 / this._pvt_members);

        this.dispatchEvent(new Event("cluster:shift"));

        return this;
    }
}
