import { random } from "../src/scripts/common/util.mjs";

/**
 * Configuration for the test runner.
 */
export const RunnerConfig = {
    /** @type {number} Number of test runs to perform. */
    Samples: 10000,
};

/**
 * Determine memory usage.
 * @returns {number} The memory usage in bytes.
 */
export function memoryUsage() {
    if (performance?.memory?.usedJSHeapSize) {
        return performance.memory.usedJSHeapSize;
    } else if (typeof process !== "undefined" && process.memoryUsage) {
        return process.memoryUsage().heapUsed;
    }

    return 0;
}

/**
 * Run the given test suite.
 * @param {Function[]} tests List of test functions to run.
 * @param {string} test_name The name of the test suite.
 */
export function runTests(tests, test_name) {
    /** @type {Object<string, { pass: number, fail: number, perf: number, mem: number }>} */
    const __tmp_stats = {};
    tests.forEach(test => {
        __tmp_stats[test.name] = { pass: 0, fail: 0, perf: 0, mem: 0 };
    });

    /** @type {number} */
    let __perf_start;
    /** @type {number} */
    let __perf_end;

    /** @type {number} */
    let __mem_start;
    /** @type {number} */
    let __mem_end;

    function __callback() {
        __perf_end = performance.now();
        __mem_end = memoryUsage();
    }

    console.log("------------------------------------------------------------------------------------------------------------");
    console.log("# Test suite: " + test_name);
    console.log();
    console.log("| Test name                                | Pass  | Fail  | Total | Pass  % | Perf (ms) | Mem (B)          |");
    console.log("|:-----------------------------------------|------:|------:|------:|--------:|----------:|-----------------:|");

    for (const test of tests) {
        const stats = __tmp_stats[test.name];

        for (let i = 0; i < RunnerConfig.Samples; i += 1) {
            try {
                __mem_start = memoryUsage();
                __perf_start = performance.now();
                test(__callback);
                stats.pass += 1;
            } catch (error) {
                __perf_end = performance.now();
                __mem_end = memoryUsage();
                stats.fail += 1;
            } finally {
                stats.perf += __perf_end - __perf_start;
                stats.mem += __mem_end - __mem_start;
            }
        } // samples

        stats.perf /= RunnerConfig.Samples;
        stats.mem /= RunnerConfig.Samples;

        const str_name = test.name.padEnd(40, " ");
        const str_pass = stats.pass.toString().padStart(5, " ");
        const str_fail = stats.fail.toString().padStart(5, " ");
        const __tmp_total = stats.pass + stats.fail;
        const str_total = __tmp_total.toString().padStart(5, " ");
        const str_percent = (100 * stats.pass / __tmp_total).toFixed(2).padStart(6, " ");
        const str_perf = stats.perf.toFixed(2).padStart(9, " ");
        const str_mem = stats.mem.toFixed(2).padStart(16, " ");

        const __log_res = `${str_name} | ${str_pass} | ${str_fail} | ${str_total} | ${str_percent}%`;
        const __log_perf = `${str_perf} | ${str_mem}`;
        const __log = `| ${__log_res} | ${__log_perf} |`;

        if (stats.fail > 0) console.error(__log);
        else console.log(__log);
    } // tests
}
