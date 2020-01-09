let obj = {
    foo: 'foo',
    baz: { a: 1 },
    arr: []
};

const defineReactive = function(data, key, val) {

    Object.defineProperty(data, key, {
        get: () => {
            // eslint-disable-next-line no-console
            console.log('get:' + key + '&value:' + val);

            observes(val);

            return val;
        },
        set: (newVal) => {
            if (newVal != val) {
                // eslint-disable-next-line no-console
                console.log('set:' + key + '&value:' + newVal);
                val = newVal;
            }
        }
    })
}

const observes = function(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        return null;
    }

    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key]);
    });
}

const set = function(data, key, val) {
    defineReactive(data, key, val);
}

const dep = function(_arrayMethods, _methods, callback) {
    Object.defineProperty(_arrayMethods, _methods, {
        enumerable: true,
        configurable: true,
        value: function(...args) {
            callback(args);
        } 
    })
}

const arrayPrototypr = Array.prototype;
const arrayMethods = Object.create(arrayPrototypr);
const _pro = [
    'push',
    'pop',
    'shift',
    'unshift'
]

_pro.forEach((methods) => {
    let original = arrayMethods[methods];

    dep(arrayMethods, methods, function m(...args) {
        const result = original.apply(this, args);
        return result;
    })
})


observes(obj);

obj.foo;
obj.foo = 'fooooooo';

obj.baz;
obj.baz = { a: 2 };

set(obj, 'bar', 'barrr')

obj.bar;
obj.bar = 'barrrrrr';

obj.arr;
obj.arr.push(1);

