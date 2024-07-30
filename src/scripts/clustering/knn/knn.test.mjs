import { random } from "../common/util.mjs";
import { DataPoint } from "../datapoint.mjs";
import { Cluster } from "../cluster.mjs";
import { KNN_algorithm } from "./knn.mjs";
import { RunnerConfig, runTests } from "../../../../quality/runner.mjs";

// ============================================================================
// KNN Algorithm tests
// ============================================================================

function knn_array_knn_algorithm(callback) {
    const __tmp_clusters_len = random(1, RunnerConfig.Samples);

    const array = [random(), random()];
    const clusters = Array.from({ length: __tmp_clusters_len }, () => new Cluster([random(), random()]));
    const k = random(1, RunnerConfig.Samples);

    const result = KNN_algorithm(array, clusters, k);

    if (k >= clusters.length) {
        if (result.length !== clusters.length) {
            throw new Error("Array KNN algorithm failed");
        }
    } else {
        if (result.length !== Math.round(k)) {
            throw new Error("Array KNN algorithm failed");
        }
    }

    callback && callback();
}

function knn_datapoint_knn_algorithm(callback) {
    const __tmp_clusters_len = random(1, RunnerConfig.Samples);

    const datapoint = new DataPoint([random(), random()]);
    const clusters = Array.from({ length: __tmp_clusters_len }, () => new Cluster([random(), random()]));
    const k = random(1, RunnerConfig.Samples);

    const result = KNN_algorithm(datapoint, clusters, k);

    if (k >= clusters.length) {
        if (result.length !== clusters.length) {
            throw new Error("DataPoint KNN algorithm failed");
        }
    } else {
        if (result.length !== Math.round(k)) {
            throw new Error("DataPoint KNN algorithm failed");
        }
    }

    callback && callback();
}

// ============================================================================
// Run tests
// ============================================================================

const __tmp_tests = [
    knn_array_knn_algorithm,
    knn_datapoint_knn_algorithm,
];

runTests(__tmp_tests, "KNN");
