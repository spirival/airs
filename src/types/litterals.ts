/**
 * Defines what is considered a "Primitive" type in JavaScript/TypeScript.
 * Includes basic data types like bigint, boolean, null, number, string, symbol, and undefined.
 */
export type Primitive =
    | bigint
    | boolean
    | null
    | number
    | string
    | symbol
    | undefined;

/**
 * Represents any valid JSON data type.
 * Can be a Primitive, an object (JSONObject), or an array (JSONArray).
 */
type JSONValue = Primitive | JSONObject | JSONArray;

/**
 * Represents a structure where keys are strings, and values can be any JSONValue.
 */
interface JSONObject {
    /**
     * Keys must be strings, values must conform to JSONValue.
     */
    [key: string]: JSONValue;
}

/**
 * Extends the Array type, restricting elements to JSONValue types only.
 */
interface JSONArray extends Array<JSONValue> {}

/**
 * A utility type to assert that the provided type is a litteral object.
 * @template T The type to check if it is an object literal..
 * @example
 * ```typescript
 * // It works
 * const l = { a: 1 };
 * const o: LiteralObject<typeof l> = l;
 *
 * // It works not
 * const d = new Date();
 * const o: LiteralObject<typeof d> = d;
 * // Type 'Date' is not assignable to type 'LiteralObject<Date>'.
 * // Types of property 'toString' are incompatible.
 * // Type '() => string' is not assignable to type 'never'.ts(2322)
 * ```
 */
export type LiteralObject<T> = {
    [key in keyof T as key extends string
        ? key
        : never]: T[key] extends JSONValue ? T[key] : never;
};

/**
 * A utility type that "widens" a type T to its broader form.
 * @example
 * ```typescript
 * const s = "lol" // typeof s -> "lol"
 * const s2: Widen<"lol"> = "lol";  // typeof s2 -> string
 * ```
 */
export type Widen<T> = T extends bigint
    ? bigint
    : T extends boolean
    ? boolean
    : T extends null
    ? null
    : T extends number
    ? number
    : T extends string
    ? string
    : T extends symbol
    ? symbol
    : T extends undefined
    ? undefined
    : T;
