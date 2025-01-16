/**
 * @packageDocumentation
 * The airs package provides a minimalist framework-agnostic reactive state library designed to be small-sized, intuitive and simple to use.
 *
 * AIRS stands for Accessible Intuitive Reactive State.
 *
 * It is based on RxJS Observables (the only dependency).
 *
 * Designed in TypeScript, this library leverages TypeScript's strong typing system to provide a robust and developer-friendly experience.
 * Using TypeScript is the best way to fully exploit the potential of the library, ensuring type safety and enabling powerful IntelliSense support in modern IDEs.
 *
 * It includes:
 * - A helper to create states that can encapsulate primitive values, literal objects, and any other kind of standard or custom objects (arrays, classes, etc.).
 * - A history-enabled helper to create states with redux devtools-like history navigation (undo, redo).
 */
export * from './types/index.ts';
export * from './state.ts';
export * from './history.ts';
export * from './types.ts';
export * from './helpers.ts';
