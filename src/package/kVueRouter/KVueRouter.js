// 1. 构建一个实例
// 2. 实例中监听地址变化, 并响应式的渲染界面
// 3. 实例中install实现一个插件, 挂载到$router
// 4. 实现router-link router-view两个组件 

// 嵌套路由要点
// KVueRouter组件
// 1.响应式current变为一个响应式数组matchs
// 2.循环把所有的相关路由都放到matchs数组内
// RouterView组件
// 1.标记组件为router-view 方便遍历查找
// 2.定义一个变量deep代表深度 表示是第几层变量 即深度标记
// 3.循环查找父级router-view 改变deep
// 4.利用deep 和 matchs对比 找出响应组件返回

// 申明一个Vue变量, 防止import引入导致打包时把Vue重复打包进去
let Vue;

class KVueRouter {
    constructor(options) {
        this.$options = options;
        // 借助vue响应式把它变成响应式数据
        this.current = window.location.hash.slice(1) || '/';
        // Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/');

        // 响应式的创建路由数组match
        Vue.util.defineReactive(this, 'matched', []);
        this.matchs(this.$options);

        // 监听拿到地址并修改地址
        window.addEventListener('hashchange', this.currentHash.bind(this));
        window.addEventListener('load', this.currentHash.bind(this));
    }

    currentHash() {
        this.current = window.location.hash.slice(1);
        this.matched = [];
        this.matchs(this.$options);
    }

    matchs(routers) {
        routers.forEach(router => {
            // 一般来说/路径下不会存放嵌套路由 所以直接push
            if (this.current === '/' && router.path === '/') {
                this.matched.push(router);
            } else if (this.current.includes(router.path) && router.path !== '/') {
                this.matched.push(router);
                if (router.children) {
                    this.matchs(router.children);
                }
            }
        });
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
            let deep = 0;
            // 将组件标记
            this.routerView = true;
            // 循环找出所有父元素 并标记深度
            let parent = this.$parent;
            while(parent) {
                if (parent && parent.routerView) {
                    deep += 1;
                }
                parent = parent.$parent;
            }

            // 匹配深度层级 找出component
            let matched = this.$router.matched;
            let _component = null;
            if (matched[deep]) {
                _component = matched[deep].components;
            }
            return h(_component)
        }
    })
}

export default KVueRouter