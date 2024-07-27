import { DataPoint } from "./datapoint.mjs";

/**
 * Represents a cluster of data points.
 */
export class Cluster {
    /**
     * Create a new cluster.
     * @param {Array<number> | DataPoint} centroid - The centroid of the cluster.
     */
    constructor(centroid) {
        /** @type {DataPoint} The centroid of the cluster. */
        this.centroid = new DataPoint(centroid);

        /** @type {Number} The total number of members in the cluster. */
        this.members = 0;
    }

    /**
     * Euclidean distance between the cluster's centroid and a data point.
     * @param {Array<number> | DataPoint} dataPoint - The data point to calculate the distance to.
     * @returns {number} The Euclidean distance.
     */
    euclideanDistance(dataPoint) {
        return this.centroid.euclideanDistance(dataPoint);
    }

    /**
     * Add a data point to the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to add.
     */
    add(dataPoint) {
        if (!(dataPoint instanceof DataPoint))
            dataPoint = new DataPoint(dataPoint);

        this.centroid.scaleBy(this.members);
        this.centroid.moveBy(dataPoint);
        this.members += 1;
        this.centroid.scaleBy(1 / this.members);
    }

    /**
     * Remove a data point from the cluster.
     * @param {Array<number> | DataPoint} dataPoint - The data point to remove.
     */
    remove(datapoint) {
        this.centroid.scaleBy(this.members);
        this.centroid.moveBy(datapoint.coords.map(x => -x));
        this.members -= 1;
        this.centroid.scaleBy(1 / this.members);
    }
};
