import { Observable } from 'rxjs';
import { BaseHistoryState } from './history.ts';
import type { BaseState } from './state.ts';

/**
 * A type representing a function that updates a state value.
 * @template T The type of the current state value.
 * @template R The type of the returned state value after update (defaults to T).
 * @param currentValue - The current state value.
 * @returns The updated state value.
 */
export type StateUpdater<T, R = T> = (currentValue: T) => R;

/**
 * Represents a generic state management interface.
 * It's implementation is designed to encapsulate a {@link BaseState} instance.
 * Provides reactive state management using observables.
 * @template T The type of the state value.
 */
export interface State<T> {
    /**
     * Retrieves the current state value.
     * @returns The current state value of type T.
     */
    (): T;

    /**
     * Updates the state with a new value or a state updater function.
     * @param newValue - The new state value or a function to compute the new value.
     * @returns The updated state value of type T.
     */
    set(newValue: T | StateUpdater<T>): T;

    /**
     * An observable that emits the current state value whenever it changes.
     * Mirrors the behavior of the value$ property in BaseState.
     */
    $: Observable<T>;
}

/**
 * Extends the generic state interface to include a patching method for partial updates.
 * Useful for managing states that are litteral objects, allowing partial modifications.
 * @template T The type of the state value.
 */
export interface LiteralObjectState<T> extends State<T> {
    /**
     * Applies partial updates to the state.
     * @param newValue - A partial object or a state updater function for partial updates.
     * @returns The updated state value of type T.
     */
    patch: (newValue: Partial<T> | StateUpdater<T, Partial<T>>) => T;
}

/**
 * Extends the generic state interface to include history-related functionality.
 * Provides methods for undoing, redoing, and retrieving historical state values.
 * Derived from the {@link BaseHistoryState} class.
 * @template T The type of the state value.
 */
export interface HistoryState<T> extends State<T> {
    /**
     * The maximum number of history states to retain.
     * Mirrors the `historyLimit` property of the BaseHistoryState class.
     */
    historyLimit: typeof BaseHistoryState.prototype.historyLimit;

    /**
     * Reverts the state to a previous value in the history.
     * Mirrors the `undo` method of the BaseHistoryState class.
     * @param times - The number of steps to undo (defaults to 1).
     */
    undo: typeof BaseHistoryState.prototype.undo;

    /**
     * Restores the state to a later value in the history if available.
     * Mirrors the `redo` method of the BaseHistoryState class.
     * @param times - The number of steps to redo (defaults to 1).
     */
    redo: typeof BaseHistoryState.prototype.redo;

    /**
     * Retrieves a list of all state values from the history.
     * Mirrors the `getAllValues` method of the BaseHistoryState class.
     * @returns An array of all state values.
     */
    getAllValues: typeof BaseHistoryState.prototype.getAllValues;

    /**
     * Retrieves a list of previous state values from the history.
     * Mirrors the `getPreviousValues` method of the BaseHistoryState class.
     * @param limit - The maximum number of previous values to retrieve (defaults to the full history length).
     * @returns An array of previous state values.
     */
    getPreviousValues: typeof BaseHistoryState.prototype.getPreviousValues;
}
