const _map = xf => reducer => {
    return (acc, value) => {
        reducer(acc, xf(value));
        return acc;
    }
};
const _filter = predicate => reducer => {
    return (acc, value) => {
        if (predicate(value)) return reducer(acc, value);
        return acc;
    }
};
const _push = (acc, value) => {
    acc.push(value);
    return acc;
};
const _compose = (functions) =>
    functions.reduce((acc, fn) =>
        (...args) => fn(acc(...args)), x => x);

/**
 * Basic class for lazy iterations
 */
class LazyIterable {
    /**
     * @param {Function} func Function for iteration method
     * @param {Array|LazyIterable} source Source for iteration method
     */
    constructor(func, source) {
        if (typeof func !== 'function') {
            throw new Error('LazyIterable(): first argument must be a function');
        }
        if (!Array.isArray(source) && source instanceof LazyIterable === false) {
            throw new Error('LazyIterable(): second argument must be a Array or LazyIterable');
        }

        this.func = func;
        this.source = source;
    }

    /**
     * Lazy map iteration
     * @param {Function} xf Transform function for Array.prototype.map
     * @returns {LMap}
     */
    lmap(xf) {
        return new LMap(xf, this);
    }

    /**
     * Lazy filter iteration
     * @param {Function} predicate Predicate for Array.prototype.filter
     * @returns {LFilter}
     */
    lfilter(predicate) {
        return new LFilter(predicate, this);
    }

    /**
     * Start iteration and calculate result into array
     * @returns {Array}
     */
    toArray() {
        return list(this);
    }
}

/**
 * Class for lazy map iteration
 */
class LMap extends LazyIterable {
}

/**
 * Class for lazy filter iteration
 */
class LFilter extends LazyIterable {
}

/**
 * Lazy map iteration
 * @param {Function} xf Transform function for Array.prototype.map
 * @param {Array|LazyIterable} source Source for iteration method
 * @returns {LMap}
 */
const map = (xf, source) => {
    return new LMap(xf, source);
};

/**
 * Lazy map iteration
 * @param {Function} xf Transform function for Array.prototype.map
 * @returns {LMap}
 */
Array.prototype.lmap = function (xf) {
    return new LMap(xf, this);
};

/**
 * Lazy filter iteration
 * @param {Function} predicate Predicate for Array.prototype.filter
 * @param {Array|LazyIterable} source Source for iteration method
 * @returns {LFilter}
 */
const filter = (predicate, source) => {
    return new LFilter(predicate, source);
};

/**
 * Lazy filter iteration
 * @param {Function} predicate Predicate for Array.prototype.filter
 * @returns {LFilter}
 */
Array.prototype.lfilter = function (predicate) {
    return new LFilter(predicate, this);
};


/**
 * Start iteration and calculate result into Array
 * @param {LazyIterable} lazyIterable
 * @returns {Array}
 */
const list = (lazyIterable) => {
    if (lazyIterable instanceof LazyIterable === false) {
        throw new Error('list(): argument must be a LazyIterable');
    }

    const toCompose = [];
    while (lazyIterable.source) {
        if (lazyIterable instanceof LFilter) {
            toCompose.push(_filter(lazyIterable.func));
        } else if (lazyIterable instanceof LMap) {
            toCompose.push(_map(lazyIterable.func));
        }

        lazyIterable = lazyIterable.source;
    }

    const sourceArray = lazyIterable;
    return sourceArray.reduce(_compose(toCompose)(_push), []);
};

module.exports = {
    filter,
    map,
    list,
    LMap,
    LFilter,
};
