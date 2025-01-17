import { BaseState } from './state.ts';
import { isNumber } from './types/predicates.ts';

/**
 * A class extending the `BaseState` to add history management capabilities.
 * Tracks changes to the state, allowing undo, redo, and history traversal.
 * Includes an optional limit for the number of historical states retained.
 * @template T The type of the state value.
 */
export class BaseHistoryState<T> extends BaseState<T> {
    /**
     * The current index in the history stack.
     * @private
     */
    private _currentValueIndex: number = 0;

    /**
     * The stack of state values representing the history.
     * @private
     */
    private values: Array<T> = [];

    /**
     * The maximum number of states to retain in history.
     * Can be a number or 'none' for unlimited history.
     * @private
     */
    private _historyLimit!: 'none' | number;

    /**
     * Gets the current index in the history stack.
     * @returns The current index.
     */
    private get currentValueIndex(): number {
        return this._currentValueIndex;
    }

    /**
     * Sets the current index in the history stack and updates the current state value.
     * @param value - The new index value.
     */
    private set currentValueIndex(value: number) {
        this._currentValueIndex = value;
        this._value$.next(this.values[this._currentValueIndex]);
    }

    /**
     * Gets the history limit.
     * @returns The current history limit ('none' or a number).
     */
    public get historyLimit(): 'none' | number {
        return this._historyLimit;
    }

    /**
     * Sets a new history limit and trims the history stack if necessary.
     * @param value - The new history limit ('none' or a number).
     */
    public set historyLimit(value: 'none' | number) {
        const previousLimit = this._historyLimit;
        this._historyLimit = value;

        if (isNumber(this.historyLimit) && this.historyLimit < 1)
            this._historyLimit = 'none';

        if (isNumber(this.historyLimit)) {
            const limitDelta =
                (previousLimit === 'none'
                    ? this.values.length
                    : previousLimit) - this.historyLimit;

            while (this.values.length > this.historyLimit) {
                this.values.shift();
            }

            if (limitDelta > 0) {
                this.currentValueIndex = Math.min(
                    0,
                    this.currentValueIndex - limitDelta
                );
            }
        }
    }

    /**
     * Initializes a new instance of BaseHistoryState with an initial value and optional history limit.
     * @param initialValue - The initial state value.
     * @param historyLimit - The maximum number of states to retain ('none' or a number, defaults to 'none').
     */
    constructor(initialValue: T, historyLimit: 'none' | number = 'none') {
        super(initialValue);
        this.historyLimit = historyLimit;
        this.set(this.value);
    }

    /**
     * Updates the state with a new value and manages the history stack.
     * @param newValue - The new state value to set.
     */
    public set(newValue: T): void {
        this.values.splice(this.currentValueIndex + 1);
        this.values.push(newValue);

        if (this._historyLimit !== 'none') {
            if (this.values.length > this._historyLimit) {
                this.values.shift();
            }
        }

        this.currentValueIndex = this.values.length - 1;
    }

    /**
     * Reverts the state to a previous value in the history.
     * @param times - The number of steps to undo (defaults to 1).
     */
    public undo(times: number = 1): void {
        this.currentValueIndex = Math.max(0, this.currentValueIndex - times);
    }

    /**
     * Restores the state to a later value in the history if available.
     * @param times - The number of steps to redo (defaults to 1).
     */
    public redo(times: number = 1): void {
        this.currentValueIndex = Math.min(
            this.values.length - 1,
            this.currentValueIndex + times
        );
    }

    /**
     * Retrieves a list of all state values from the history.
     * @returns An array of all history state values.
     */
    public getAllValues(): T[] {
        return this.values.slice();
    }

    /**
     * Retrieves a list of previous state values from the history relative to current value index.
     * @param limit - The maximum number of previous values to retrieve (defaults to the current value index).
     * @returns An array of previous state values.
     */
    public getPreviousValues(limit: number = this._currentValueIndex): T[] {
        limit =
            limit < 1
                ? this._currentValueIndex
                : Math.min(limit, this._currentValueIndex);

        return this.values.slice(
            Math.min(0, this._currentValueIndex - limit),
            this._currentValueIndex
        );
    }
}
