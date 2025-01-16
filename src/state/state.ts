// Implementation of the modular State pattern

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A base class for managing reactive state.
 * @template T The type of the state value.
 */
export class BaseState<T> {
    /**
     * A BehaviorSubject to hold the internal state value.
     * @protected
     */
    protected _value$: BehaviorSubject<T>;

    /**
     * An observable that emits the state value whenever it changes.
     * @public
     * @readonly
     */
    public readonly value$: Observable<T>;

    /**
     * Initializes the state with an initial value.
     * @param initialValue - The initial value of the state.
     */
    constructor(initialValue: T) {
        this._value$ = new BehaviorSubject<T>(initialValue);
        this.value$ = this._value$.asObservable();
    }

    /**
     * Gets the current state value.
     * @returns The current state value of type T.
     */
    get value(): T {
        return this._value$.getValue();
    }

    /**
     * Updates the state with a new value.
     * @param newValue - The new value to set for the state.
     */
    set value(newValue: T) {
        this._value$.next(newValue);
    }
}
