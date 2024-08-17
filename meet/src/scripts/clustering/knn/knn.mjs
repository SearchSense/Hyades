import { DataPoint } from "../datapoint.mjs";
import { Cluster } from "../cluster.mjs";

/**
 * Determine the cluster of a data point using the K-Nearest Neighbors algorithm.
 * @param {Array<number> | DataPoint} datapoint - The data point to classify.
 * @param {Array<Cluster>} clusters - The clusters to compare against.
 * @param {number} k - The number of neighbors to consider.
 * @returns {Array<{ cluster: Cluster, distance: number, index: number }>} The ranked clusters.
 */
export function KNN_algorithm(datapoint, clusters, k) {
    if (!(datapoint instanceof DataPoint))
        datapoint = new DataPoint(datapoint);

    if (!Array.isArray(clusters) || clusters.length === 0)
        throw new Error("Clusters must be a non-empty array");

    if (typeof k !== "number" || k < 1)
        throw new Error("K must be a number greater than or equal to 1");
    if (isNaN(k) || !isFinite(k))
        throw new Error("K must be a finite number");
    const __tmp_k = Math.round(Math.min(k, clusters.length));

    const __tmp_distances = datapoint.euclideanDistances(clusters);
    const __tmp_ranks = __tmp_distances.map((d, i) => ({ d, i }));

    __tmp_ranks.sort((a, b) => a.d - b.d);

    return __tmp_ranks.slice(0, __tmp_k)
        .map(r => ({
            cluster: clusters[r.i],
            distance: r.d,
            index: r.i,
        }))
}
