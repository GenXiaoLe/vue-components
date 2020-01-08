// 1. 每个编译模版接受一个DOM, KVue实例
// 2. 创建一个方法用于模版分类 插值还是指令
// 3. 写一个插值方法 用于编译插值
// 4. 写一个元素相关指令的方法 用于编译特定指令 如 k-text k-html

class Compliers {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;

        if (this.$el) {
            this.complier(this.$el);
        }
    }

    complier(el) {
        let childNodes = el.childNodes;

        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                this.renderElement(node);
            } else if (this.isInter(node)) {
                this.renderText(node);
            }

            if (node.childNodes && node.childNodes.length) {
                this.complier(node);
            }
        });
    }

    isElement(el) {
        return el.nodeType === 1;
    }

    isInter(el) {
        return el.nodeType === 3 && /\{\{(.*)\}\}/.test(el.textContent)
    }

    renderText(el) {
        this.updater(el, RegExp.$1, 'text');
    }

    renderElement(el) {
        let attrs = el.attributes;
        Array.from(attrs).forEach(attr => {
            let _name = attr.name; // v-xx
            let _value = attr.value;
            let dir = _name.substring(2); // v-xx => xx 

            let fn = this[dir + 'Complier'];
            fn && fn.call(this, el, _value);
        })
    }

    updater(el, key, dir) {
        // 数据初始化
        let fn = this[dir + 'Updater'];
        fn && fn.call(this, el, this.$vm[key]);

        // 监听数据
        new Watcher(this.$vm, key, (newVal) => {
            fn && fn.call(this, el, newVal);
        })
    }

    textUpdater(el, val) {
        el.textContent = val;
    }

    textComplier(el, key) {
        this.updater(el, key, 'text');
    }

    htmlComplier(el, key) {
        this.updater(el, key, 'html');
    }

    htmlUpdater(el, val) {
        el.innerHTML = val;
    }
}

// 用于监听值变化 调用更新方法
class Watcher {
    constructor(vm, key, fn) {
        this.$vm = vm;
        this.$key = key;
        this.$fn = fn; // fn 为传入回调 用于出发update 接受参数为 val

        // Dep.target就相当于一个全局变量的中间件 用来储存每一个this
        Dep.target = this;
        vm[key]; // 调用某个key的get 把watcher push进去做到key与watcher一一对应
        Dep.target = null;
    }

    // 更新属性 这时候属性已经是响应过后的数据 直接操作即可
    update() {
        this.$fn.call(this.$vm, this.$vm[this.$key]);
    }
}

// 用来储存watch和key对应的数组 相当于一个管家
// eslint-disable-next-line no-unused-vars
class Dep {
    constructor() {
        this.dep = []
    }

    addDep() {
        this.dep.push(Dep.target);
    }

    noifty() {
        this.dep.forEach(watcher => {
            if (watcher) {
                watcher.update();
            }
        })
    }
}

window.console.log(Compliers);