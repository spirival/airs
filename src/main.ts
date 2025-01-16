import { state } from 'state';

const counter = state(1);

// Getting the last value
console.log(counter()); // 1
console.log(counter.set(2)); // 2

// Listen to counter updates and logs them
const sub = counter.$.subscribe(console.log);
// Console : 2
counter.set(3);
// Console : 3
sub.unsubscribe();
