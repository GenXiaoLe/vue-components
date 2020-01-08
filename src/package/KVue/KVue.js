// 1.创建一个Kvue实例 接受一个options 里面包含el 以及 data
// 2.将data变为响应式元素
// 3.写一个proxy代理方法把data中的数据挂载到KVue实例上
class KVue {
    constructor(options) {
        this.$options = options;
        // data 是对象还是数组
        if (Object.prototype.toString.call(options.data) === '[object Function]') {
            this.$data = options.data();
        } else {
            this.$data = options.data;
        }

        this.obsever(this.$data);

        this.proxy(this);

        // eslint-disable-next-line no-undef
        new Compliers(this.$options.el, this);
    }

    obsever(data) {
        if (Object.prototype.toString.call(data) !== '[object Object]') {
            window.console.error('被观察的data必须是一个对象');
            return;
        }

        new Obsevers(data);
    }

    proxy(vm) {
        Object.keys(vm.$data).forEach(key => {
            Object.defineProperty(vm, key, {
                get: () => {
                    return vm.$data[key];
                },
                set: (val) => {
                    vm.$data[key] = val;
                }
            })
        })
    }
}

class Obsevers {
    constructor(val) {
        this.val = val;
        this.walk(val);
    }

    walk(val) {
        Object.keys(val).forEach(key => {
            defineReactive(val, key, val[key]);
        });
    }
}


const defineReactive = function(data, key, val) {

    // eslint-disable-next-line no-undef
    const dep = new Dep();

    Object.defineProperty(data, key, {
        get: () => {
            window.console.log('get:' + key + '&value:' + val);
            dep.addDep();
            return val;
        },
        set: (newVal) => {
            if (newVal != val) {
                window.console.log('set:' + key + '&value:' + newVal);
                val = newVal;

                // eslint-disable-next-line no-undef
                dep.noifty();
            }
        }
    })
}

window.console.log(KVue);