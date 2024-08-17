/**
 * Configuration for the Hyades application.
 */
export const HyadesConfig = {
    /**
     * Canvas rendering configuration.
     */
    Drawing: {
        /** @type {number} The radius of the data points. */
        DataPointRadius: 2,

        /** @type {number} The radius of the centroids. */
        CentroidRadius: 4,
    },

    /**
     * Animation rendering configuration.
     */
    Animation: {
        /** @type {number} The animation interval, in milliseconds. */
        Interval: 1000 / 30,

        /** @type {boolean} Loop active. */
        Active: false,

        /** @type {number} The batch size for the animation. */
        BatchSize: 300,
    },

    /**
     * Clustering configuration.
     */
    Clustering: {
        /** @type {(...options: any[]) => Array<{ cluster: Cluster, distance: number, index: number }>} The clustering algorithm to use. */
        Algorithm: undefined,
    }
};
