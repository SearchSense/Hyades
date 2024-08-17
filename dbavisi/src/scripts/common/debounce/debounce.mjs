/**
 * Mood Swings
 * @author Dwij Bavisi <dwij@dbavisi.net>
 */
/**
 * Type checking for positive finite numbers.
 * @param value Value to check.
 * @returns True if the value is a positive finite number.
 */
export function checkFinite(value) {
    return (typeof value === 'number' && Number.isFinite(value) && value > 0);
}
/**
 * Minds-in-Sync Debounce Modes.
 * - TRAILING: Debounce with trailing edge.
 * - LEADING: Debounce with leading edge.
 *
 * Hybrid mode can be achieved by combining the flags.
 */
export var EDGE;
(function (EDGE) {
    /** Debounce with leading edge. */ EDGE[EDGE["LEADING"] = 1] = "LEADING";
    /** Debounce with trailing edge. */ EDGE[EDGE["TRAILING"] = 2] = "TRAILING";
})(EDGE || (EDGE = {}));
/**
 * Minds-in-Sync Debounce Context Change Strategies.
 * - RAISE: Raise an error preventing the change of context.
 * - FLUSH: Flush the saved context and start with the new context.
 * - SWITCH: Replace the saved context without resetting the debounce.
 * - IGNORE: Ignore the change of context.
 */
export var STRATEGY;
(function (STRATEGY) {
    /** Raise an error preventing the change of context. */ STRATEGY[STRATEGY["RAISE"] = 1] = "RAISE";
    /** Flush the saved context and start with the new context. */ STRATEGY[STRATEGY["FLUSH"] = 2] = "FLUSH";
    /** Replace the saved context without resetting the debounce. */ STRATEGY[STRATEGY["SWITCH"] = 3] = "SWITCH";
    /** Ignore the change of context. */ STRATEGY[STRATEGY["IGNORE"] = 4] = "IGNORE";
})(STRATEGY || (STRATEGY = {}));
/**
 * Minds-in-Sync Debounce Method Factory.
 * @param method Original method to debounce.
 * @param edge Debounce modes. (default: LEADING)
 * @param timeout Debounce timeout in milliseconds. (default: 360)
 * @param interval Interval in milliseconds between invocations. (default: -1)
 * @param strategy Context change strategy. (default: IGNORE)
 * @returns Debounced method.
 *
 * Set positive interval to invoke the method at most once per interval.
 */
export function debounce(method, edge, timeout, interval, strategy) {
    /** ---=== Type Checking ===--- */
    if (typeof method !== 'function')
        throw new TypeError('Please provide a valid method to debounce.');
    if (typeof edge !== 'number' || (edge & (1 /* EDGE.LEADING */ | 2 /* EDGE.TRAILING */)) === 0)
        edge = 1 /* EDGE.LEADING */;
    if (!checkFinite(timeout))
        timeout = 360;
    if (!checkFinite(interval))
        interval = -1;
    if (!checkFinite(strategy) || strategy > 4 /* STRATEGY.IGNORE */)
        strategy = 4 /* STRATEGY.IGNORE */;
    /** ---=== Type Checking ===--- */
    const leading = (edge & 1 /* EDGE.LEADING */) === 1 /* EDGE.LEADING */;
    const trailing = (edge & 2 /* EDGE.TRAILING */) === 2 /* EDGE.TRAILING */;
    let timer = null;
    let timestamp = 0;
    let context = undefined;
    let result = undefined;
    let update = undefined;
    let invoke = function () {
        /**
         * Reaching here means the wait time has been exceeded.
         * - Clear the debounce timer.
         * - Invoke method if trailing edge is enabled.
         */
        timer = null;
        timestamp = Date.now();
        if (context === undefined || update === undefined) {
            // This block is hit when using leading edge or interval.
            return result;
        }
        if (trailing) {
            result = method.apply(context, update);
            update = undefined;
        }
        return result;
    };
    const flush = function () {
        if (context === undefined || update === undefined) {
            /**
             * TODO: Add support for custom behavior using middlewares.
             * Debounced method has not been invoked yet.
             */
            return result;
        }
        if (timer === null)
            return result;
        clearTimeout(timer);
        return invoke();
    };
    const debounced = function (...args) {
        if (context === undefined)
            context = this;
        else if (context !== this) {
            /**
             * TODO: Add support for custom behavior using middlewares.
             * Debounced method invoked with different context / scope.
             */
            switch (strategy) {
                case 1 /* STRATEGY.RAISE */:
                    throw new Error('Debounced method invoked with different context.');
                case 2 /* STRATEGY.FLUSH */:
                    flush();
                case 3 /* STRATEGY.SWITCH */:
                    context = this;
                case 4 /* STRATEGY.IGNORE */:
                    break;
            }
        } // Check if the context has changed.
        if (timer === null) {
            if (leading) {
                timestamp = Date.now();
                result = method.apply(context, args);
                update = undefined;
            }
            else {
                update = args;
            }
            // Activate the debounce timer.
            timer = setTimeout(invoke, timeout);
        }
        else {
            clearTimeout(timer);
            const now = Date.now();
            const elapsed = now - timestamp;
            if (interval && interval > 0 && elapsed >= interval) {
                // Warantee maximum delay between invocations.
                timestamp = now;
                result = method.apply(context, args);
                update = undefined;
                // Reschedule the debounce timer.
                timer = setTimeout(invoke, timeout);
            }
            else {
                /**
                 * Not using interval or elapsed time is less than wait.
                 * Save the arguments for later use.
                 */
                update = args;
                if (interval && interval > 0) {
                    // Ensure the method is invoked within the interval time.
                    timer = setTimeout(debounced, interval - elapsed, ...args);
                }
                else {
                    // Reschedule the debounce timer.
                    timer = setTimeout(invoke, timeout);
                }
            }
        } // Check if the timer already exists.
        return result;
    };
    return Object.assign(debounced, {
        flush,
        set timeout(value) { if (checkFinite(value))
            timeout = value; },
        set interval(value) { if (checkFinite(value))
            interval = value; },
        set strategy(value) {
            if (checkFinite(value) && value <= 4 /* STRATEGY.IGNORE */)
                strategy = value;
        },
    });
}
/**
 * Minds-in-Sync Throttle Method Factory.
 * @param method Original method to throttle.
 * @param interval Throttle interval in milliseconds. (default: 16)
 * @returns Throttled method.
 *
 * Throttled method will be invoked at most once per interval.
 * Default interval is set to 16ms which is equivalent to 60fps.
 */
export function throttle(method, interval) {
    /** ---=== Type Checking ===--- */
    if (typeof method !== 'function')
        throw new TypeError('Please provide a valid method to throttle.');
    if (!checkFinite(interval))
        interval = 16;
    /** ---=== Type Checking ===--- */
    return debounce(method, 1 /* EDGE.LEADING */ | 2 /* EDGE.TRAILING */, interval, interval);
}
