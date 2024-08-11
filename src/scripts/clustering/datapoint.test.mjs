import { random } from "../common/util.mjs";
import { DataPoint } from "./datapoint.mjs";
import { RunnerConfig, runTests } from "../../../quality/runner.mjs";

// ============================================================================
// Constructor tests
// ============================================================================

function datapoint_scalar_constructor(callback) {
    const __tmp_scalar = random();
    const datapoint = new DataPoint(__tmp_scalar);

    if (datapoint.x !== __tmp_scalar || datapoint.y !== __tmp_scalar) {
        throw new Error("Scalar constructor failed");
    }

    callback && callback();
}

function datapoint_array_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const datapoint = new DataPoint([__tmp_x, __tmp_y]);

    if (datapoint.x !== __tmp_x || datapoint.y !== __tmp_y) {
        throw new Error("Array constructor failed");
    }

    callback && callback();
}

function datapoint_datapoint_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const __tmp_datapoint = new DataPoint([__tmp_x, __tmp_y]);
    const datapoint = new DataPoint(__tmp_datapoint);

    if (datapoint.x !== __tmp_x || datapoint.y !== __tmp_y) {
        throw new Error("DataPoint constructor failed");
    }

    callback && callback();
}

// ============================================================================
// Jump tests
// ============================================================================

function datapoint_scalar_jump(callback) {
    const __tmp_scalar = random();
    const datapoint = new DataPoint([random(), random()]);
    datapoint.jumpTo(__tmp_scalar);

    if (datapoint.x !== __tmp_scalar || datapoint.y !== __tmp_scalar) {
        throw new Error("Scalar jump failed");
    }

    callback && callback();
}

function datapoint_array_jump(callback) {
    const __tmp_jump = [random(), random()];
    const datapoint = new DataPoint([random(), random()]);
    datapoint.jumpTo(__tmp_jump);

    if (datapoint.x !== __tmp_jump[0] || datapoint.y !== __tmp_jump[1]) {
        throw new Error("Array jump failed");
    }

    callback && callback();
}

function datapoint_datapoint_jump(callback) {
    const __tmp_datapoint = new DataPoint([random(), random()]);
    const datapoint = new DataPoint([random(), random()]);
    datapoint.jumpTo(__tmp_datapoint);

    if (datapoint.x !== __tmp_datapoint.x || datapoint.y !== __tmp_datapoint.y) {
        throw new Error("DataPoint jump failed");
    }

    callback && callback();
}

// ============================================================================
// Move tests
// ============================================================================

function datapoint_scalar_move(callback) {
    const __tmp_scalar = random();
    const datapoint = new DataPoint([random(), random()]);

    const __tmp_move_x = datapoint.x + __tmp_scalar;
    const __tmp_move_y = datapoint.y + __tmp_scalar;
    datapoint.moveBy(__tmp_scalar);

    if (datapoint.x !== __tmp_move_x || datapoint.y !== __tmp_move_y) {
        throw new Error("Scalar move failed");
    }

    callback && callback();
}

function datapoint_array_move(callback) {
    const __tmp_move = [random(), random()];
    const datapoint = new DataPoint([random(), random()]);

    const __tmp_move_x = datapoint.x + __tmp_move[0];
    const __tmp_move_y = datapoint.y + __tmp_move[1];
    datapoint.moveBy(__tmp_move);

    if (datapoint.x !== __tmp_move_x || datapoint.y !== __tmp_move_y) {
        throw new Error("Array move failed");
    }

    callback && callback();
}

function datapoint_datapoint_move(callback) {
    const __tmp_datapoint = new DataPoint([random(), random()]);
    const datapoint = new DataPoint([random(), random()]);

    const __tmp_move_x = datapoint.x + __tmp_datapoint.x;
    const __tmp_move_y = datapoint.y + __tmp_datapoint.y;
    datapoint.moveBy(__tmp_datapoint);

    if (datapoint.x !== __tmp_move_x || datapoint.y !== __tmp_move_y) {
        throw new Error("DataPoint move failed");
    }

    callback && callback();
}

// ============================================================================
// Scale tests
// ============================================================================

function datapoint_scalar_scale(callback) {
    const __tmp_scalar = random();
    const datapoint = new DataPoint([random(), random()]);

    const __tmp_scale_x = datapoint.x * __tmp_scalar;
    const __tmp_scale_y = datapoint.y * __tmp_scalar;
    datapoint.scaleBy(__tmp_scalar);

    if (datapoint.x !== __tmp_scale_x || datapoint.y !== __tmp_scale_y) {
        throw new Error("Scalar scale failed");
    }

    callback && callback();
}

function datapoint_array_scale(callback) {
    const __tmp_scale = [random(), random()];
    const datapoint = new DataPoint([random(), random()]);

    const __tmp_scale_x = datapoint.x * __tmp_scale[0];
    const __tmp_scale_y = datapoint.y * __tmp_scale[1];
    datapoint.scaleBy(__tmp_scale);

    if (datapoint.x !== __tmp_scale_x || datapoint.y !== __tmp_scale_y) {
        throw new Error("Array scale failed");
    }

    callback && callback();
}

function datapoint_datapoint_scale(callback) {
    const __tmp_datapoint = new DataPoint([random(), random()]);
    const datapoint = new DataPoint([random(), random()]);

    const __tmp_scale_x = datapoint.x * __tmp_datapoint.x;
    const __tmp_scale_y = datapoint.y * __tmp_datapoint.y;
    datapoint.scaleBy(__tmp_datapoint);

    if (datapoint.x !== __tmp_scale_x || datapoint.y !== __tmp_scale_y) {
        throw new Error("DataPoint scale failed");
    }

    callback && callback();
}

// ============================================================================
// Euclidean distance tests
// ============================================================================

function datapoint_array_euclidean_distance(callback) {
    const datapoint = new DataPoint([random(), random()]);
    const array = [random(), random()];

    const __tmp_distance = Math.sqrt(
        Math.pow(datapoint.x - array[0], 2) +
        Math.pow(datapoint.y - array[1], 2)
    );

    if (datapoint.euclideanDistance(array) !== __tmp_distance) {
        throw new Error("Array euclidean distance failed");
    }

    callback && callback();
}

function datapoint_datapoint_euclidean_distance(callback) {
    const datapoint = new DataPoint([random(), random()]);
    const other = new DataPoint([random(), random()]);

    const __tmp_distance = Math.sqrt(
        Math.pow(datapoint.x - other.x, 2) +
        Math.pow(datapoint.y - other.y, 2)
    );

    if (datapoint.euclideanDistance(other) !== __tmp_distance) {
        throw new Error("DataPoint euclidean distance failed");
    }

    callback && callback();
}

// ============================================================================
// Euclidean distances tests
// ============================================================================

function datapoint_array_euclidean_distances(callback) {
    const datapoint = new DataPoint([random(), random()]);
    const __tmp_arr_len = random(1,);
    const array = Array.from({ length: __tmp_arr_len }, () => [random(), random()]);

    const __tmp_distances = array.map(a => Math.sqrt(
        Math.pow(datapoint.x - a[0], 2) +
        Math.pow(datapoint.y - a[1], 2)
    ));

    const distances_toFixed = datapoint.euclideanDistances(array).map(d => d.toFixed(2));
    const __tmp_distances_toFixed = __tmp_distances.map(d => d.toFixed(2));

    for (let i = 0; i < distances_toFixed.length; i += 1) {
        if (distances_toFixed[i] !== __tmp_distances_toFixed[i]) {
            throw new Error("Array euclidean distances failed");
        }
    }

    callback && callback();
}

function datapoint_datapoint_euclidean_distances(callback) {
    const datapoint = new DataPoint([random(), random()]);
    const __tmp_arr_len = random(1, RunnerConfig.Samples);
    const other = Array.from({ length: __tmp_arr_len }, () => new DataPoint([random(), random()]));

    const __tmp_distances = other.map(o => Math.sqrt(
        Math.pow(datapoint.x - o.x, 2) +
        Math.pow(datapoint.y - o.y, 2)
    ));

    const distances_toFixed = datapoint.euclideanDistances(other).map(d => d.toFixed(2));
    const __tmp_distances_toFixed = __tmp_distances.map(d => d.toFixed(2));

    for (let i = 0; i < distances_toFixed.length; i += 1) {
        if (distances_toFixed[i] !== __tmp_distances_toFixed[i]) {
            throw new Error("DataPoint euclidean distances failed");
        }
    }

    callback && callback();
}

// ============================================================================
// Test runner
// ============================================================================

const __tmp_tests = [
    datapoint_scalar_constructor,
    datapoint_array_constructor,
    datapoint_datapoint_constructor,
    datapoint_scalar_jump,
    datapoint_array_jump,
    datapoint_datapoint_jump,
    datapoint_scalar_move,
    datapoint_array_move,
    datapoint_datapoint_move,
    datapoint_scalar_scale,
    datapoint_array_scale,
    datapoint_datapoint_scale,
    datapoint_array_euclidean_distance,
    datapoint_datapoint_euclidean_distance,
    datapoint_array_euclidean_distances,
    datapoint_datapoint_euclidean_distances,
];

runTests(__tmp_tests, "DataPoint");
