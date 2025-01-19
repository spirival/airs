<p align="center">
  <img src="assets/images/air-logo.png" alt="Kintsugi logo" width="300">
</p>

# AIRS (Accessible Intuitive Reactive State)

A lightweight and flexible **reactive state management library** designed for both primitive values and complex objects, with support for history management and reactivity.

---

<div align="center">
  <a href="https://codecov.io/github/spirival/airs" >
 <img src="https://codecov.io/github/spirival/airs/graph/badge.svg?token=GFV3SDTODA" alt="Test coverage"/>
 </a>
  <a href="https://github.com/spirival/airs/issues" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/issues/spirival/airs.svg" alt="Issues">
  </a>
</div>
<br/>
<div align="center">
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="https://developer.mozilla.org/fr/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
  </a>
  <a href="https://rxjs.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS">
  </a>
  <a href="https://vitejs.fr/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  </a>
  <a href="https://vitest.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B" alt="Vitest">
  </a>
  <a href="https://rxjs.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM">
  </a>
</div>

---

## Features

- **Reactive State Management**: Effortlessly manage state updates and listen to changes.
- **Support for Primitive and Object States**: Works seamlessly with numbers, strings, objects, and even class instances.
- **Patchable Literral Object States**: Update literral object states with partial changes.
- **History Management**: Undo, redo, and traverse state history.
- **TypeScript Support**: Enjoy robust type-checking and autocompletion.
- **Universal**: Compatible with both server-side and client-side environments, offering seamless integration across platforms.

---

## Installation

Install the library via npm or yarn:

```bash
npm install @spirival/airs
```

```bash
yarn add @spirival/airs
```

---

## API Overview

### `state(initialValue)`

Creates a reactive state wrapper around a value.

#### Parameters

- `initialValue`: The initial value of the state. Supports primitives, objects, and class instances.

#### Returns

A state wrapper with the following methods and properties:

- `state()`: Retrieves the current value.
- `state.set(value)`: Updates the state value.
- `state.$`: Observable for state changes.
- `state.patch(value)`: (For objects only) Partially updates the object state.

### `history(initialValue, historyLimit)`

Creates a reactive state wrapper with history management.

#### Parameters

- `initialValue`: The initial value of the state.
- `historyLimit` (optional): Maximum number of states to retain in history. Default is `'none'` (unlimited).

#### Returns

A history state wrapper with the following methods and properties:

- `history()`: Retrieves the current value.
- `history.set(value)`: Updates the state value.
- `history.undo()`: Reverts to the previous state.
- `history.redo()`: Moves forward in history.
- `history.getAllValues()`: Retrieves all states values.
- `history.getPreviousValues()`: Retrieves past states value.
- `history.$`: Observable for state changes.

---

## Examples

### Primitive State Management

```typescript
const counter = state(1);

// Get the current value
console.log(counter()); // 1

// Update the value
console.log(counter.set(2)); // 2

// Subscribe to updates
const subscription = counter.$.subscribe(console.log);
counter.set(3); // Logs: 3

// Unsubscribe when done
subscription.unsubscribe();
```

### Object State Management

```typescript
const config = state({ theme: 'dark', language: 'en' });

// Get the current value
console.log(config()); // { theme: 'dark', language: 'en' }

// Partially update the object
console.log(config.patch({ theme: 'light' })); // { theme: 'light', language: 'en' }

// Subscribe to updates
const subscription = config.$.subscribe(console.log);
config.patch({ language: 'fr' }); // Logs: { theme: 'light', language: 'fr' }

// Unsubscribe when done
subscription.unsubscribe();
```

### Class Instance State Management

```typescript
const dateState = state(new Date(1689112800000));

// Get the current value
console.log(dateState().getTime()); // 1689112800000

// Subscribe to updates
const subscription = dateState.$.subscribe((date) => console.log(date.getTime()));
dateState.set(new Date()); // Logs the updated timestamp

// Unsubscribe when done
subscription.unsubscribe();
```

### State History Management

```typescript
const countdown = history('10');

// Subscribe to updates with a delay
countdown.$.subscribe(console.log);

// Update state with a series of changes
for (let i = 9; i > 0; i--) countdown.set(`${i}`);
countdown.set('Engine ignition confirmed.');
countdown.set('Oh wait! Wait!');
countdown.set("... It's ok guys. False alarm.");

// Undo and redo actions
countdown.undo(2);
countdown.set('Liftoff!');
```

---

## License

This library is licensed under the [MIT License](LICENSE).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a clear description of your changes.
