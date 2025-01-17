import { skip } from 'rxjs';
import { history } from 'src/helpers.ts';
import { HistoryState } from 'src/types.ts';
import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest';

let nav = history('homepage');

describe('Tests over a navigation history', () => {
    beforeEach(() => {
        nav = history('homepage');
    });

    test('Navigation value type should be of type HistoryState<string>', () => {
        expectTypeOf(nav).toEqualTypeOf<HistoryState<string>>();
    });

    test('Initial nav value should be "homepage"', () => {
        expect(nav()).toBe('homepage');
    });

    test('Set history value to "about" should return "about"', () => {
        expect(nav.set('about')).toBe('about');
    });

    test('Set history value to "about" with state updater should return "about"', () => {
        expect(nav.set(() => 'about')).toBe('about');
    });

    test('Listen to nav change, set nav value to "about" after 10s, should produce "about"', () => {
        const sub = nav.$.pipe(skip(1)).subscribe((value) => {
            expect(value).toEqual('about');
            sub.unsubscribe();
        });
        setTimeout(() => {
            nav.set('about');
        }, 10_000);
    });

    test('Set history value to "about", undo, current value should return "homepage"', () => {
        nav.set('about');
        nav.undo();
        expect(nav()).toBe('homepage');
    });

    test('Set history value to "about", undo, redo, current value should returns "about"', () => {
        nav.set('about');
        nav.undo();
        nav.redo();
        expect(nav()).toBe('about');
    });

    test('Initialize with history limit lesser than 1 should set history limit to "none"', () => {
        nav = history('homepage', 0);
        expect(nav.historyLimit).toBe('none');
    });

    test('Setting history limit different from "non", setting values should trigger history values shifting', () => {
        nav = history('homepage', 1);

        nav.set('about');
        nav.set('page 1');
        nav.set('page 2');

        expect(nav.getAllValues().length).toBe(1);
    });

    test('Setting a positive history limit after a "none" limit should change the current state value index if the values length is greater than the history limit', () => {
        const nav = history('initial', 'none');
        nav.set('value1');
        nav.set('value2');
        nav.set('value3');

        const currentValueIndex = nav.getAllValues().length - 1;

        nav.historyLimit = 2;

        const limitDelta = nav.getAllValues().length - nav.historyLimit;
        const newCurrentValueIndex = Math.min(
            0,
            currentValueIndex - limitDelta
        );

        expect(nav.getAllValues()[newCurrentValueIndex]).toBe(nav());
    });

    test('Getting all values should return an array of all values', () => {
        nav.set('about');
        nav.set('clients');
        nav.set('commands');
        expect(nav.getAllValues()).toEqual([
            'homepage',
            'about',
            'clients',
            'commands',
        ]);
    });

    test('Getting previous values should return an array of previous values', () => {
        nav.set('about');
        nav.set('clients');
        nav.set('commands');
        expect(nav.getPreviousValues()).toEqual([
            'homepage',
            'about',
            'clients',
        ]);
    });

    test("Getting previous values with limit lesser than 1 should return an array of the current item's previous values ", () => {
        nav.set('about');
        nav.set('clients');
        nav.set('commands');
        expect(nav.getPreviousValues(0)).toEqual([
            'homepage',
            'about',
            'clients',
        ]);
    });
});
