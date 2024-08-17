import { DataPoint } from "./datapoint.mjs";
import { random } from "../common/util.mjs";

export class Cluster extends DataPoint {
    /**
     * Create a new data point.
     * @param {Array<number> | DataPoint | number} coordinates
     */
    constructor(coordinates) {
        super(coordinates);

        /** @type {number} The total number of members in the cluster. */
        this.__pvt_members = 1;

        /** @type {DataPoint} The aggregate of the cluster. */
        this.__cache_aggregate = new DataPoint(this);

        /** @type {Map<string, number>} The number of data points in the cluster at a specific location. */
        this.datapoint_count = new Map();

        /** @type {number} Color of the cluster. */
        this.__pvt_color = Math.round(random(0x202020FF, 0xDFDFDFFF));

        /** @type {string} The color of the cluster. */
        this.color = `#${this.__pvt_color.toString(16).padStart(8, '0').slice(0, 6)}`;
    }

    /** The total number of members in the cluster. */
    get members() {
        return this.__pvt_members;
    }

    /**
     * The number of data points in the cluster at a specific location.
     * @param {Array<number> | DataPoint} dataPoint - The data point to check.
     * @returns {number} The number of data points at the location
     */
    get_datapoint_count(dataPoint) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        if (this.datapoint_count[`${dataPoint.x}_${dataPoint.y}`] === undefined) {
            return 0;
        }
        return this.datapoint_count[`${dataPoint.x}_${dataPoint.y}`];
    }

    /**
     * Increase the number of data points in the cluster at a specific location.
     * @param {Array<number> | DataPoint} dataPoint - The data point to increase.
     * @param {number} count - The number of data points to increase.
     * @returns {void}
     */
    increase_by(dataPoint, count) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        if (this.datapoint_count[`${dataPoint.x}_${dataPoint.y}`] === undefined) {
            this.datapoint_count[`${dataPoint.x}_${dataPoint.y}`] = 0;
        }
        this.datapoint_count[`${dataPoint.x}_${dataPoint.y}`] += count;
        this.__pvt_members += count;
    }

    /**
     * Add a data point to the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to add.
     * @param {number} count - The number of data points to add.
     * @returns {Cluster} The current instance.
    */
    add(dataPoint, count = 1) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        this.__cache_aggregate.moveBy(dataPoint, count);
        this.increase_by(dataPoint, count);
        this.jumpTo(this.__cache_aggregate).scaleBy(1 / this.__pvt_members);

        return this;
    }

    /**
     * Remove a data point from the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to remove.
     * @param {number} count - The number of data points to remove.
     * @returns {Cluster} The current instance.
     */
    remove(dataPoint, count = 1) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        this.__cache_aggregate.moveBy([dataPoint.x, dataPoint.y], -count);
        this.increase_by(dataPoint, -count);
        this.jumpTo(this.__cache_aggregate).scaleBy(1 / this.__pvt_members);

        return this;
    }
}
