import { skip } from 'rxjs';
import { state } from 'src/helpers.ts';
import { LiteralObjectState } from 'src/types.ts';
import { describe, test, expect, beforeEach, expectTypeOf } from 'vitest';

let mouse = state({ x: 0, y: 0 });

describe('Tests over a mouse position object', () => {
    beforeEach(() => {
        mouse = state({ x: 0, y: 0 });
    });

    test('Mouse value type should be of type LiteralObjectState<{ x: number; y: number }>', () => {
        expectTypeOf(mouse).toEqualTypeOf<
            LiteralObjectState<{ x: number; y: number }>
        >();
    });

    test('Initial mouse value should equal { x: 0, y: 0 }', () => {
        expect(mouse()).toEqual({ x: 0, y: 0 });
    });

    test('Set mouse value to { x: 1, y: 0 } should return { x: 1, y: 0 }', () => {
        expect(mouse.set({ x: 1, y: 0 })).toEqual({ x: 1, y: 0 });
    });

    test('Set mouse value to { x: 1, y: 0 } with state update should return { x: 1, y: 0 }', () => {
        expect(mouse.set(() => ({ x: 1, y: 0 }))).toEqual({ x: 1, y: 0 });
    });

    test('The mouse patch function should exists', () => {
        expect(mouse.patch).toBeDefined();
    });

    test('Listen to mouse change, set mouse x value to 1 after 10s, should produce { x: 1, y: 0 }', () => {
        const sub = mouse.$.pipe(skip(1)).subscribe((value) => {
            expect(value).toEqual({ x: 1, y: 0 });
            sub.unsubscribe();
        });
        setTimeout(() => {
            mouse.patch({ x: 1 });
        }, 10_000);
    });

    test('Patch mouse x value to 1 should return { x: 1, y: 0 }', () => {
        expect(mouse.patch({ x: 1 })).toEqual({ x: 1, y: 0 });
    });

    test('Patch mouse x value with state updater to 1 should return { x: 1, y: 0 }', () => {
        expect(mouse.patch(() => ({ x: 1 }))).toEqual({ x: 1, y: 0 });
    });
});
