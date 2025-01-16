import { LiteralObject } from './litterals.ts';

/**
 * Represents a type predicate function that determines if a given value is of type T.
 * @template T The type that the predicate checks for.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is of type T.
 */
export type Predicate<T> = (value: unknown) => value is T;

/**
 * Checks if a value is of type string.
 * @param value - The value to check.
 * @returns True if the value is a string, otherwise false.
 */
export const isString: Predicate<string> = (value: unknown) =>
    typeof value === 'string';

/**
 * Checks if a value is of type number.
 * @param value - The value to check.
 * @returns True if the value is a number, otherwise false.
 */
export const isNumber: Predicate<number> = (value: unknown) =>
    typeof value === 'number';

/**
 * Checks if a value is of type object.
 * Note: This excludes null values.
 * @param value - The value to check.
 * @returns True if the value is an object, otherwise false.
 */
export const isObject: Predicate<object> = (value: unknown): value is object =>
    typeof value === 'object' && value !== null;

/**
 * Checks if a value is a literal object.
 * A literal object is defined as an object that directly inherits from Object.prototype.
 * @param value - The value to check.
 * @returns True if the value is a literal object, otherwise false.
 */
export const isLiteralObject: Predicate<LiteralObject<unknown>> = (
    value: unknown
): value is LiteralObject<unknown> => {
    return (
        typeof value === 'object' &&
        value !== null &&
        Object.getPrototypeOf(value) === Object.prototype
    );
};
