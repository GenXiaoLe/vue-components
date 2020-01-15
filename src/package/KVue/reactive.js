let obj = {
    foo: 'foo',
    baz: { a: 1 },
    arr: []
};

// 取出数组的原型方法
const arrayPrototypr = Array.prototype;
// copy一下
const arrayMethods = Object.create(arrayPrototypr);
const _pro = [
    'push',
    'pop',
    'shift',
    'unshift'
];

_pro.forEach((methods) => {
    // 重写数组的几个方法
    arrayMethods[methods] = function mutator() {
        const result = arrayPrototypr[methods].apply(this, arguments);

        // eslint-disable-next-line no-console
        console.log('数组发生了改变 去做更新处理');

        return result;
    };
})

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
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
        // 覆盖原型，替换操作
        obj.__proto__ = arrayMethods;

        let keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
            observes(obj[i]);
        }
    } else {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
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

obj.arr;
obj.arr.push(1);

