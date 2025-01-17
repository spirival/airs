import { BaseHistoryState } from './history.ts';
import { BaseState } from './state.ts';
import {
    State,
    LiteralObjectState,
    StateUpdater,
    HistoryState,
} from './types.ts';
import { Primitive, LiteralObject, Widen } from './types/litterals.ts';
import { isLiteralObject } from './types/predicates.ts';

/**
 * Creates a state wrapper around a value, providing reactive state management.
 * Supports both primitive values and literal objects. For literal objects, a patch method is available.
 *
 * @remarks
 * If it were possible to determine which methods of an object cause mutations,
 * a proxy could be implemented on the wrapper to wrap the mutable methods of
 * the instance on the wrapper itself (instead of just having "set").
 * These wrapped methods would call the original mutable methods and next the
 * resulting value of the object into the BehaviourSubject, ensuring a fully
 * immutable instance via State.
 * Need for a standard object-contextualized "Function.mutate" boolean.
 *
 * TC39, W3C, WHATWG, Google, Microsoft, Mozilla, Apple, Node and Cie, would it be a good idea ?... :)
 *
 * @template T The type of the state value.
 * @param initialValue - The initial value of the state.
 * @returns A state wrapper object with methods to get, set, and (for literal objects) patch the value.
 *
 * @example
 *
 * Here is an example for managing a primitive value :
 * ```typescript
 * const counter = state(1);
 *
 * // Getting the last value
 * console.log(counter()); // 1
 * console.log(counter.set(2)); // 2
 *
 * // Listen to counter updates and logs them
 * const sub = counter.$.subscribe(console.log);
 * counter.set(3);
 * // Console : 3
 *
 * // Don't forget to unsubscribe when the observer is no longer used
 * sub.unsubscribe();
 * ```
 *
 * @example
 *
 * Here is an example for managing an object value :
 * ```typescript
 * const EA = state({ author: "EM", launched: false });
 * 
 * // Getting the last value
 * console.log(EA()); // { author: "EM", launched: false }
 * console.log(EA.patch({ author: "IM" })); // { author: "IM", launched: false }
 * 
 * // Listen to EA updates and logs them
 * const sub = EA.$.subscribe(console.log);
 * EA.patch({ launched: true });
 * // Console : { author: "IM", launched: true }
 * 
 * // Don't forget to unsubscribe when the observer is no longer used
 * sub.unsubscribe();
 * ```
 *
 * @example
 *
 * Here is an example for managing another kind of class instance :
 * ```typescript
 * const d = state(new Date(1689112800000));
 * 
 * // Getting the last value
 * console.log(d().getTime()); // 1689112800000
 * 
 * // Listen to now updates and logs them
 * const sub = d.$.subscribe((d) => console.log(d.getTime()));
 * d.set(new Date());
 * // Console : Now timestamp
 * 
 * // Don't forget to unsubscribe when the observer is no longer used
sub.unsubscribe();
 * ```
 *
 * @example
 *
 * Here is an example for managing a state history :
 * ```typescript
 * const l = history('10');
 * 
 * l.$.pipe(concatMap((v) => timer(1000).pipe(map(() => v)))).subscribe(
 *     console.log
 * );
 * 
 * for (let i = 9; i > 0; i--) l.set(`${i}`);
 * 
 * l.set('Engine ignition confirmed.');
 * l.set('Oh wait ! Wait !');
 * l.set("... It's ok guys. False alarm.");
 * l.undo(2);
 * l.set('Litoff !');
 * ```
 */
export function state<T extends Primitive>(initialValue: T): State<Widen<T>>;
export function state<T extends LiteralObject<T>>(
    initialValue: T
): LiteralObjectState<T>;
export function state<T>(initialValue: T): State<T>;
export function state<T>(initialValue: T): any {
    const s = new BaseState<T>(initialValue);
    const wrapper = function () {
        return s.value;
    };

    wrapper.set = (newValue: T | StateUpdater<T>) => {
        if (typeof newValue === 'function') {
            s.value = (newValue as StateUpdater<T>)(s.value);
        } else {
            s.value = newValue;
        }
        return s.value;
    };

    wrapper.$ = s.value$;

    if (isLiteralObject(initialValue)) {
        wrapper.patch = (
            newValue: Partial<T> | StateUpdater<T, Partial<T>>
        ) => {
            if (typeof newValue === 'function') {
                s.value = {
                    ...s.value,
                    ...(newValue as StateUpdater<T>)(s.value),
                };
                return s.value;
            } else if (
                isLiteralObject(initialValue) &&
                isLiteralObject(newValue)
            ) {
                s.value = { ...s.value, ...newValue };
                return s.value;
            }
        };
    }
    return wrapper;
}

/**
 * Creates a state wrapper with history management capabilities, allowing undo, redo, and history traversal.
 *
 * @template T The type of the state value.
 * @param initialValue - The initial value of the state.
 * @param historyLimit - The maximum number of states to retain in history ('none' for unlimited, defaults to 'none').
 * @returns A history state wrapper object with methods to get, set, undo, redo, and retrieve previous values.
 */
export function history<T>(
    initialValue: T,
    historyLimit: 'none' | number = 'none'
): HistoryState<T> {
    const s = new BaseHistoryState(initialValue, historyLimit);

    const wrapper: HistoryState<T> = Object.assign(
        function () {
            return s.value;
        },
        {
            set(newValue: T | StateUpdater<T>) {
                if (typeof newValue === 'function') {
                    s.set((newValue as StateUpdater<T>)(s.value));
                } else {
                    s.set(newValue);
                }
                return s.value;
            },

            undo: BaseHistoryState.prototype.undo.bind(s),
            redo: BaseHistoryState.prototype.redo.bind(s),
            getAllValues: BaseHistoryState.prototype.getAllValues.bind(s),
            getPreviousValues:
                BaseHistoryState.prototype.getPreviousValues.bind(s),
            $: s.value$,
        }
    ) as HistoryState<T>;

    Object.defineProperty(wrapper, 'historyLimit', {
        get: () => s.historyLimit,
        set: (newLimit: 'none' | number) => {
            s.historyLimit = newLimit;
        },
    });

    return wrapper;
}
