### 概要
- Vuex源码在实现过程中 this._vm = undefined

### 领域
- Vue

### 课程
- Web全栈架构师016期 

### 章节
- 1-2 02课 Vue全家桶原理剖析 vue02-作业讲解

### 事件
- 约27min

### 具体描述
- 老师在约27分钟的时候 在KVue文件中对 store.getters 使用 defineProperty get() 进行赋值 代码如下:

```js

    this._wapperGetter = options.getters;
    const store = this;
    const computed = {};
    this.getters = {};
    Object.keys(this._wapperGetter).forEach(key => {
        let fn = store._wapperGetter[key];
        computed[key] = function() {
            return fn(store.state);
        };

        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        });
    });

    this._vm = new Vue({
        data: {
            $$state: options.state
        },
        computed
    });

```
- 但我在实现代码的时候发现 在如下代码中会出错，查找原因发现如下:

```js
    
    Object.keys(this._wapperGetter).forEach(key => {
        let fn = store._wapperGetter[key];
        computed[key] = function() {
            return fn(store.state);
        };

        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        });
    });

    // 运行之后console.log(this.getters) -> this.getters = {};
    // store.getters值依然为{}, 排查原因后发现: store._vm = undefined;
    // 我的理解为 this._vm的赋值在 this._wapperGetter forEach之后, 这个时候由于this._vm未被定义, 调用的值自然为undefined

```

- 我的问题就是: 老师在讲课时候能够正常调用, 但是我在实现代码的时候发现这样做有问题, 是我这面写法有误, 还是哪理解的有问题呢？
