import { random } from "../common/util.mjs";
import { DataPoint } from "./datapoint.mjs";
import { Cluster } from "./cluster.mjs";
import { runTests } from "../../../quality/runner.mjs";

// ============================================================================
// Constructor tests
// ============================================================================

function cluster_scalar_constructor(callback) {
    const __tmp_scalar = random();
    const cluster = new Cluster(__tmp_scalar);

    if (cluster.x !== __tmp_scalar || cluster.y !== __tmp_scalar) {
        throw new Error("Scalar constructor failed");
    }

    callback && callback();
}

function cluster_array_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const cluster = new Cluster([__tmp_x, __tmp_y]);

    if (cluster.x !== __tmp_x || cluster.y !== __tmp_y) {
        throw new Error("Array constructor failed");
    }

    callback && callback();
}

function cluster_datapoint_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const __tmp_datapoint = new DataPoint([__tmp_x, __tmp_y]);
    const cluster = new Cluster(__tmp_datapoint);

    if (cluster.x !== __tmp_x || cluster.y !== __tmp_y) {
        throw new Error("DataPoint constructor failed");
    }

    callback && callback();
}

function cluster_cluster_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const __tmp_cluster = new Cluster([__tmp_x, __tmp_y]);
    const cluster = new Cluster(__tmp_cluster);

    if (cluster.x !== __tmp_x || cluster.y !== __tmp_y) {
        throw new Error("Cluster constructor failed");
    }

    callback && callback();
}

// ============================================================================
// Add tests
// ============================================================================

function cluster_array_add(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const cluster = new Cluster([__tmp_x, __tmp_y]);
    const __tmp_array = [random(), random()];
    cluster.add(__tmp_array);

    if (cluster.x !== (__tmp_x + __tmp_array[0]) / 2 ||
        cluster.y !== (__tmp_y + __tmp_array[1]) / 2) {
        throw new Error("Array add failed");
    }

    callback && callback();
}

function cluster_datapoint_add(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const cluster = new Cluster([__tmp_x, __tmp_y]);
    const __tmp_datapoint = new DataPoint([random(), random()]);
    cluster.add(__tmp_datapoint);

    if (cluster.x !== (__tmp_x + __tmp_datapoint.x) / 2 ||
        cluster.y !== (__tmp_y + __tmp_datapoint.y) / 2) {
        throw new Error("DataPoint add failed");
    }

    callback && callback();
}

// ============================================================================
// Remove tests
// ============================================================================

function cluster_array_remove(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const cluster = new Cluster([__tmp_x, __tmp_y]);
    const __tmp_array = [random(), random()];
    cluster.add(__tmp_array);
    cluster.remove(__tmp_array);

    if (cluster.x.toFixed(2) !== __tmp_x.toFixed(2) ||
        cluster.y.toFixed(2) !== __tmp_y.toFixed(2)) {
        throw new Error("Array remove failed");
    }

    callback && callback();
}

function cluster_datapoint_remove(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const cluster = new Cluster([__tmp_x, __tmp_y]);
    const __tmp_datapoint = new DataPoint([random(), random()]);
    cluster.add(__tmp_datapoint);
    cluster.remove(__tmp_datapoint);

    if (cluster.x.toFixed(2) !== __tmp_x.toFixed(2) ||
        cluster.y.toFixed(2) !== __tmp_y.toFixed(2)) {
        throw new Error("DataPoint remove failed");
    }

    callback && callback();
}

// ============================================================================
// Test runner
// ============================================================================

const __tmp_tests = [
    cluster_scalar_constructor,
    cluster_array_constructor,
    cluster_datapoint_constructor,
    cluster_cluster_constructor,
    cluster_array_add,
    cluster_datapoint_add,
    cluster_array_remove,
    cluster_datapoint_remove,
];

runTests(__tmp_tests, "Cluster");
