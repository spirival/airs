# AIRS (Accessible Intuitive Reactive State)

A lightweight and flexible **reactive state management library** designed for both primitive values and complex objects, with support for history management and reactivity.

---

## Features

- **Reactive State Management**: Effortlessly manage state updates and listen to changes.
- **Support for Primitive and Object States**: Works seamlessly with numbers, strings, objects, and even class instances.
- **Patchable Literral Object States**: Update literral object states with partial changes.
- **History Management**: Undo, redo, and traverse state history.
- **TypeScript Support**: Enjoy robust type-checking and autocompletion.

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
- `history.getPreviousValues()`: Retrieves past states.
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
