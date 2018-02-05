# Lazy iterations for JavaScript

A Transducers implementation for JavaScript with a beautiful code style

## Classic style
```js
[0,1,2,3,4]
    .lmap(x => x ** 2)
    .lfilter(x => x % 2)
    .toArray()
```

## Python-like style
```js
import {map, filter, list} from 'lazy-iterations'

const powered = map(x => x ** 2, [0,1,2,3,4])
const evens = filter(x => x % 2, powered)
const result = list(evens)
```
