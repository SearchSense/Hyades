import { DataPoint } from "./datapoint.mjs";

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
    }

    /** The total number of members in the cluster. */
    get members() {
        return this.__pvt_members;
    }

    /**
     * Add a data point to the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to add.
     * @returns {Cluster} The current instance.
     */
    add(dataPoint) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        this.__pvt_members += 1;
        this.__cache_aggregate.moveBy(dataPoint);
        this.jumpTo(this.__cache_aggregate).scaleBy(1 / this.__pvt_members);

        return this;
    }

    /**
     * Remove a data point from the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to remove.
     * @returns {Cluster} The current instance.
     */
    remove(dataPoint) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        this.__pvt_members -= 1;
        this.__cache_aggregate.moveBy([-dataPoint.x, -dataPoint.y]);
        this.jumpTo(this.__cache_aggregate).scaleBy(1 / this.__pvt_members);

        return this;
    }
}
