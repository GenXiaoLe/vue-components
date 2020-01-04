// 1. 构建一个实例
// 2. 实例中监听地址变化, 并响应式的渲染界面
// 3. 实例中install实现一个插件, 挂载到$router
// 4. 实现router-link router-view两个组件 

// 申明一个Vue变量, 防止import引入导致打包时把Vue重复打包进去
let Vue;

class KVueRouter {
    constructor(options) {
        this.$options = options;
        // 借助vue响应式把它变成响应式数据
        // this.current = '/';
        Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/');

        // 监听拿到地址并修改地址
        window.addEventListener('hashchange', this.currentHash.bind(this));
        window.addEventListener('load', this.currentHash.bind(this));
    }

    currentHash() {
        this.current = window.location.hash.slice(1);
    }
}

KVueRouter.install = function(_Vue) {
    Vue = _Vue;

    //使用mixin, 拿到实例后的相关属性并挂载到prototype上
    Vue.mixin({
        beforeCreate() {
            // 拿到vue挂载到所有属性 以后可以使用this.$router调用实例
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router;
            }
        }
    })

    // 挂载router-link组件
    Vue.component('RouterLink', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            return h(
                'a',
                {
                    attrs: {
                        href: `#${this.to}`
                    }
                },
                [
                    this.$slots.default
                ]
            ) 
        }
    })

    // 挂载router-view组件
    Vue.component('RouterView', {
        render(h) {
            let _router = this.$router;
            let _component = _router.$options.find(router => router.path === _router.current).components;
            return h(_component)
        }
    })
}

export default KVueRouter