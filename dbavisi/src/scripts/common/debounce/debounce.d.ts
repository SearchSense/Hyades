/**
 * Mood Swings
 * @author Dwij Bavisi <dwij@dbavisi.net>
 */
/**
 * Type checking for positive finite numbers.
 * @param value Value to check.
 * @returns True if the value is a positive finite number.
 */
export declare function checkFinite(value: unknown): value is number;
/**
 * Minds-in-Sync Debounce Modes.
 * - TRAILING: Debounce with trailing edge.
 * - LEADING: Debounce with leading edge.
 *
 * Hybrid mode can be achieved by combining the flags.
 */
export declare const enum EDGE {
    /** Debounce with leading edge. */ LEADING = 1,
    /** Debounce with trailing edge. */ TRAILING = 2
}
/**
 * Minds-in-Sync Debounce Context Change Strategies.
 * - RAISE: Raise an error preventing the change of context.
 * - FLUSH: Flush the saved context and start with the new context.
 * - SWITCH: Replace the saved context without resetting the debounce.
 * - IGNORE: Ignore the change of context.
 */
export declare const enum STRATEGY {
    /** Raise an error preventing the change of context. */ RAISE = 1,
    /** Flush the saved context and start with the new context. */ FLUSH = 2,
    /** Replace the saved context without resetting the debounce. */ SWITCH = 3,
    /** Ignore the change of context. */ IGNORE = 4
}
/** Minds-in-Sync Debounced Method. */
export interface DebouncedMethod<T, A extends unknown[], R> {
    (this: T, ...args: A): R | undefined;
    /** Invoke the scheduled method immediately and reset the debounce timer. */
    flush(): R | undefined;
    /** Set the timeout for the debounce. */
    set timeout(value: number);
    /** Set the interval between invocations. */
    set interval(value: number);
    /** Set the context change strategy. */
    set strategy(value: STRATEGY);
}
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
export declare function debounce<T, A extends unknown[], R extends unknown>(method: (this: T, ...args: A) => R, edge?: EDGE, timeout?: number, interval?: number, strategy?: STRATEGY): DebouncedMethod<T, A, R>;
/**
 * Minds-in-Sync Throttle Method Factory.
 * @param method Original method to throttle.
 * @param interval Throttle interval in milliseconds. (default: 16)
 * @returns Throttled method.
 *
 * Throttled method will be invoked at most once per interval.
 * Default interval is set to 16ms which is equivalent to 60fps.
 */
export declare function throttle<T, A extends unknown[], R extends unknown>(method: (this: T, ...args: A) => R, interval?: number): DebouncedMethod<T, A, R>;
