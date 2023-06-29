
<!--#echo json="package.json" key="name" underline="=" -->
read-relaxed-json-from-stdin-pmb
================================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Read and parse JSON objects from standard input. They may or may not be
wrapped in an array. Hoard all the objects in RAM. Return a promise for an
array of all those objects.
<!--/#echo -->



Squandering RAM like crazy.
---------------------------

In the project this was born from, RAM usage has not been a concern yet.
Thus, it's currently implemented quick-and-dirty.

__Prepare for a temporary RAM spike of 10 times your input data size__
and also a 100% load on one CPU core for (depending on input size)
up to a few minutes.

In addition to hoarding all the objects, the wrapper array detection is
implemented naively and not very robust. It's meant as a mere convenience:

* If the first line has a `[` or `{`
  and in front of that has something that looks like an export mechanism,
  the export mechanism is discarded.
* In the last line, any trailing `)` and/or `;` are discarded.
* If data doesn't start with `[`, all of it is wrapped in `[…]`.
* Any inverse pair of `}` and `{` that has a newline between them,
  is assumed to be an object border and thus a comma is inserted.
* This happens with several steps of RegExps replacements on a string
  representation of the entire input, putting garbage collection to the test.
* If the final record read is `null`, it's discarded instead.
  This is a convenience to help your input source produce a valid JSON array
  without having to care about whether to print a comma after each record:
  It can just always print the comma, and then print `null]` later.



API
---

This module exports one function:

### readRelaxedJsonFromStdin(opt)

`opt` is an optional options object that supports these optional keys:

* `logFunc` (default = `false`): Discard progress messages.
  Otherwise, a function to call for informational progress messages.
  Will be called with the template string as first argument, and for messages
  that contain `%s` placeholders, additional values that go into those slots.
  Thus, API is compatible with `console.info` and its siblings.
* `offset` (default = 0), `limit` (default = 0), `defaultLimit` (default = 0):
  * All of them, if set, are expected to be non-negative integer numbers.
  * If any of them is truthy (expectation: a positive number), the input array
    is `.slice()`d for your API convenience.
    This happens as an extra step after reading and decoding,
    so it increases RAM and CPU usage rather than saving any.
  * `offset` is how many records are discarded from the start of the array.
  * If `limit` is 0, `defaultLimit` is used instead.
  * `limit` (or `defaultLimit`), if truthy, denotes the maximum number of
    records to return. `0` means unlimited.






<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
MIT
<!--/#echo -->
