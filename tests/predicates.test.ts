import { isNumber, isObject, isString } from 'src/types/predicates.ts';
import { describe, test, expect } from 'vitest';

describe('Tests over predicates', () => {
    test('isString("falcon") should return true', () => {
        expect(isString('falcon')).toBe(true);
    });

    test('isNumber(1) should return true', () => {
        expect(isNumber(1)).toBe(true);
    });

    test('isObject({}) should return true', () => {
        expect(isObject({})).toBe(true);
    });
});
