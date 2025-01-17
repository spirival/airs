import { skip } from 'rxjs';
import { state } from 'src/helpers.ts';
import { State } from 'src/types.ts';
import { describe, test, expect, beforeEach, expectTypeOf } from 'vitest';

let counter = state(0);

describe('Tests over a counter', () => {
    beforeEach(() => {
        counter = state(0);
    });

    test('Counter value type is number', () => {
        expectTypeOf(counter).toEqualTypeOf<State<number>>();
    });

    test('Initial counter value is 0', () => {
        expect(counter()).toBe(0);
    });

    test('Set counter value to 1 returns 1', () => {
        expect(counter.set(1)).toBe(1);
    });

    test('Set counter value to 1 with state updater returns 1', () => {
        expect(counter.set(() => 1)).toBe(1);
    });

    test('Listen to counter change, set counter value to 1 after 10s, produce 1', () => {
        const sub = counter.$.pipe(skip(1)).subscribe((value) => {
            expect(value).toBe(1);
            sub.unsubscribe();
        });
        setTimeout(() => {
            counter.set(1);
        }, 10_000);
    });
});
