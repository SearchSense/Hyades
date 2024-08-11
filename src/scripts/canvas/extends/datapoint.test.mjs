import { random } from "../../common/util.mjs";
import { CanvasDataPoint } from "./datapoint.mjs";
import { runTests } from "../../../../quality/runner.mjs";

// ============================================================================
// Constructor tests
// ============================================================================

function datapoint_scalar_constructor(callback) {
    const __tmp_scalar = random();
    const datapoint = new CanvasDataPoint(__tmp_scalar);

    if (datapoint.x !== __tmp_scalar || datapoint.y !== __tmp_scalar) {
        throw new Error("Scalar constructor failed");
    }

    callback && callback();
}

function datapoint_array_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const datapoint = new CanvasDataPoint([__tmp_x, __tmp_y]);

    if (datapoint.x !== __tmp_x || datapoint.y !== __tmp_y) {
        throw new Error("Array constructor failed");
    }

    callback && callback();
}

function datapoint_datapoint_constructor(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const __tmp_datapoint = new CanvasDataPoint([__tmp_x, __tmp_y]);
    const datapoint = new CanvasDataPoint(__tmp_datapoint);

    if (datapoint.x !== __tmp_x || datapoint.y !== __tmp_y) {
        throw new Error("DataPoint constructor failed");
    }

    callback && callback();
}

// ============================================================================
// Get neighbours tests
// ============================================================================

function datapoint_get_neighbours(callback) {
    const __tmp_x = random();
    const __tmp_y = random();
    const datapoint = new CanvasDataPoint([__tmp_x, __tmp_y]);
    const neighbours = datapoint.getNeighbours();

    const __tmp_arr_neighbours = [
        [__tmp_x + 1, __tmp_y],
        [__tmp_x - 1, __tmp_y],
        [__tmp_x, __tmp_y + 1],
        [__tmp_x, __tmp_y - 1],
        [__tmp_x + 1, __tmp_y + 1],
        [__tmp_x + 1, __tmp_y - 1],
        [__tmp_x - 1, __tmp_y + 1],
        [__tmp_x - 1, __tmp_y - 1],
    ];

    for (let i = 0; i < neighbours.length; i += 1) {
        if (neighbours[i].x !== __tmp_arr_neighbours[i][0] || neighbours[i].y !== __tmp_arr_neighbours[i][1]) {
            throw new Error("Get neighbours failed");
        }
    }

    callback && callback();
}

// ============================================================================
// Run tests
// ============================================================================

const __tmp_tests = [
    datapoint_scalar_constructor,
    datapoint_array_constructor,
    datapoint_datapoint_constructor,
    datapoint_get_neighbours,
];

runTests(__tmp_tests, "CanvasDataPoint");
