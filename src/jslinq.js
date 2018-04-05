/**
 * This class `Enumerable` use for reference the idea of C# IEnumerable.
 * 
 * @class Enumerable
 */
class Enumerable {
    constructor(o) {
        if (o[Symbol.iterator] === undefined) {
            this.o = [o];
        } else {
            this.o = o;
        }
    }

    getEnumerator() {
        return new Enumerator(this, this.o);
    }

    static asEnumerable(o) {
        return new Enumerable(o).getEnumerator();
    }

    static * rangeImpl(start, count) {
        for (let i = 0; i < count; i++) {
            yield start + i;
        }
    }

    static range(start, count) {
        return new Enumerator(null, null, this.rangeImpl(start, count));
    }

    *
    wrap(arr) {
        for (const key in arr) {
            yield arr[key];
        }
    }

    *
    [Symbol.iterator]() {
        yield* this.wrap(this.o);
    }
}

class Enumerator {
    constructor(that, arr, g) {
        this.g = g || that.wrap(arr);
    }

    *
    [Symbol.iterator]() {
        yield* this.g;
    }

    *
    selectImpl(g, selector) {
        var _iterator = g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            yield selector(_next.value);
        }
    }

    select(selector) {
        this.g = this.selectImpl(this.g, selector);
        return this;
    }

    *
    whereImpl(g, predicate) {
        var _iterator = g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            if (predicate(_next.value) === true) {
                yield _next.value;
            }
        }
    }

    where(predicate) {
        this.g = this.whereImpl(this.g, predicate);
        return this;
    }

    forEach(action) {
        var _iterator = this.g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            action(_next.value);
        }
    }

    aggregate(func) {
        var _iterator = this.g;
        var _next = _iterator.next();
        if (_next.done) {
            throw Error('No Elements');
        }
        var value = _next.value;
        while ((_next = _iterator.next()).done === false) {
            value = func(value, _next.value);
        }
        return value;
    }

    any(predicate) {
        var _iterator = this.g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            if (predicate(_next.value) === true) {
                return false;
            }
        }
        return false;
    }

    all(predicate) {
        var _iterator = this.g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            if (predicate(_next.value) === false) {
                return false;
            }
        }
        return true;
    }

    *
    concatImpl(g, enumerable) {
        var _iterator = g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            yield _next.value;
        }
        var _eNext = null;
        while ((_eNext = enumerable.g.next()).done === false) {
            yield _eNext.value;
        }
    }

    concat(enumerable) {
        this.g = this.concatImpl(this.g, enumerable);
        return this;
    }

    *
    exceptImpl(g, enumerable) {
        var _iterator = g;
        var _next = null;
        var _eNext = null;
        var _set = new Set();
        while ((_eNext = enumerable.g.next()).done === false) {
            _set.add(_eNext.value);
        }

        while ((_next = _iterator.next()).done === false) {
            if (_set.has(_next.value) === false) {
                _set.add(_next.value);
                yield _next.value;
            }
        }
    }

    except(enumerable) {
        this.g = this.exceptImpl(this.g, enumerable);
        return this;
    }

    *
    zipImpl(g, enumerable, resultSelector) {
        var _iterator = g;
        var _next = null;
        var _eNext = null;
        while ((_next = _iterator.next()).done === false && (_eNext = enumerable.g.next()).done === false) {
            yield resultSelector(_next.value, _eNext.value);
        }
    }

    zip(enumerable, resultSelector) {
        this.g = this.zipImpl(this.g, enumerable, resultSelector);
        return this;
    }

    *
    repeatImpl(g, item, count) {
        var _count = count || 0;
        while (_count-- > 0) {
            yield item;
        }
    }

    repeat(item, count) {
        this.g = this.repeatImpl(this.g, item, count);
        return this;
    }

    toArray() {
        var array = [];
        var _iterator = this.g;
        var _next = null;
        while ((_next = _iterator.next()).done === false) {
            array.push(_next.value);
        }
        return array;
    }
}

Array.prototype.asEnumerable = function() {
    'use strict';
    return Enumerable.asEnumerable(this);
};