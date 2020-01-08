let obj = {
    foo: 'foo',
    baz: { a: 1 }
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


observes(obj);

obj.foo;
obj.foo = 'fooooooo';

obj.baz;
obj.baz = { a: 2 };

set(obj, 'bar', 'barrr')

obj.bar;
obj.bar = 'barrrrrr';