/**
 * This module contains the configuration for the Hyades application.
 */
const CONFIG = {
    /**
     * N dimensional data point coordinates.
     * Affects the memory usage, precision and performance of the application.
     */
    datapoint_coords_t: Uint32Array,

    /**
     * Canvas rendering configuration.
     */
    CANVAS: {
        /**
         * The radius of the data points.
         */
        datapoint_radius: 2,

        /**
         * The radius of the centroids.
         */
        centroid_radius: 4,
    },

    /**
     * Clustering algorithm configuration.
     */
    CLUSTER: {
        /**
         * Assign the data points to the nearest centroid.
         */
        ASSIGN: undefined,
    },

    /**
     * Animation configuration.
     */
    ANIMATION: {
        /**
         * The animation interval, in milliseconds.
         */
        INTERFAVE: 1000 / 60,

        /**
         * Loop active.
         */
        ACTIVE: false,
    },
};

export default CONFIG;
