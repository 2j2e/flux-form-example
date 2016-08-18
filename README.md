## Disclaimer
This is a readonly example of form implementation based on unidirectional data flow which uses redux-form, redux-thunk and redux-saga. It just shows how the basic flow can look like and what are the pitfalls can be. The source code was extracted right from the test branch that succesefully died after research was finished.

## Summary
My message to everyone try to avoid writing your own redux form library. You will need to mirror a tons of stuff to state than handle the flux data flow, synchronize it with async API calls, validation, fields events, etc.