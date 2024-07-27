import { Cluster } from "../cluster.mjs";
import { DataPoint } from "../datapoint.mjs";

/**
 * K-Nearest Neighbors algorithm
 * @param {DataPoint} datapoint - Point to be classified
 * @param {Array<Cluster>} clusters - Clusters to be classified
 * @returns {Cluster} - Cluster that the point belongs to
 */
export function knn_algorithm(datapoint, clusters) {
    let dis = Infinity;
    let ret_cluster = clusters[0];
    for (let cluster of clusters) {
        if (dis > cluster.euclideanDistance(datapoint)) {
            dis = cluster.euclideanDistance(datapoint);
            ret_cluster = cluster;
        }
    }
    return ret_cluster;
}
