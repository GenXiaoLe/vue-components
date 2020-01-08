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
        this.updater(el, this.$vm, RegExp.$1, 'text');
    }

    renderElement(el) {
        let attrs = el.attributes;
        Array.from(attrs).forEach(attr => {
            let _name = attr.name; // v-xx
            let _value = attr.value;
            let dir = _name.substring(2); // v-xx => xx 
            this[dir + 'Complier'](el, this.$vm, _value);
        })
    }

    updater(el, vm, key, dict) {
        this[dict + 'Updater'](el, vm, key);
    }

    textUpdater(el, vm, key) {
        // 数据初始化
        el.textContent = vm[key];

        // 监听数据
        new Watcher(vm, key, function(newVal) {
            el.textContent = newVal;
        })
    }

    textComplier(el, vm, key) {
        this.updater(el, vm, key, 'text');
    }

    htmlComplier(el, vm, key) {
        el.innerHTML = vm[key];
    }
}


let watchers = []; // 用于存放Watcher的中间件
class Watcher {
    constructor(vm, key, fn) {
        this.$vm = vm;
        this.$key = key;
        this.$fn = fn; // fn 为传入回调 用于出发update 接受参数为 val

        watchers.push(this);
    }

    update() {
        this.$fn.call(this.$vm, this.$vm[this.$key]);
    }
}

window.console.log(Compliers);