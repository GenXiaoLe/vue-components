#### vue文件初始化渲染过程
1. 目录 vue/src/core/instance/index.js
    - 首先定义Vue实例 并利用initMixin(Vue)混入函数 调用中的_init(options)方法以及传入用户配置
2. 目录 vue/src/core/instance/init.js
    - 把用户传入的options和自带的options合并为$options
    - 调用 initLifecycle(this) 定义 $parent $children $root $refs 等引用类型 在这里可以看出 Vue创建 自上而下
    - 调用 initEvents(this) 监听挂载父元素上的事件 在这里可以看出 Vue中事件方法的规则 谁监听 谁使用
    - 调用 initRender(this) 主要用来初始化 $slots $createElement 等渲染需要的方法
    - 调用 initState(this) 重要函数 实现proxy代理属性 响应式属性之类的初始化
    - 初始化结束后 调用vm.$mount 对当前函数进行挂载
3. 目录 vue/src/platforms/web/entry-runtime-with-compiler.js
    - 先保存原本的$mount 在对vue上的$mount进行覆盖 执行时先对vue实例进行判断 优先使用render 如果没有则使用template生产render 如果没有最后使用el
    - 结束后返回调用之前保存的好的原生mount进行挂载 注意这里原生mount.call(this, el, hydrating) 使用的是el 所以如果使用template需要手动调用$mount进行挂载
4. 目录 vue/src/platforms/web/runtime/index.js
    - 先创建__patch__ 使用patch函数将补丁方法映射到这上面
    - 创建真正的$mount 调用了一个mountComponent(this, el, hydrating)的方法
5. 目录 vue/src/core/instance/lifecycle.js
    - vue实例创建时 调用了lifecycleMixin方法混入 再次方法中定义了mountComponent
    - mountComponent中定义了一个 updateComponent方法 此方法在调用时进行 _update 与 _render操作 其中_update在这个混入文件中创建 _render 在renderMixin混入文件中创建
    - 为当前组件监听一个watcher watcher内部调用updateComponent方法 执行update(render()) 得到真实dom 并通知页面更新



#### vue文件响应式原理
1. 目录 vue/src/core/instance/state.js
    - initState() 声明一部分初始化 比如 initData initProps initComputed
    - initData中 根据data类型解析data 将data进行代理proxy 最后开始observe
2. 目录 vue/src/core/observer/index.js
    - observe在每个传入对象上进行判断它上面是否有__ob__ 如果有那么证明他就是已经Observer过得对象 可以直接返回 否则进行Observer
    - Observer 对每个Observer实例创建一个__ob__ 该子ob保存的就是当前这个实例this 创建一个this.dep = new Dep() 判断类型 如果为数组类型 observeArray 否则 walk
        - walk 对每个属性进行 defineReactive响应式
        - observeArray 对里面每个内容重新进行observe 重复以上步骤
    - defineReactive 首先创建一个 new Dep()为大管家 用来管理的watcher 2.0中他们的关系为1对1
        - 在正式进入响应式步骤之前会创建一个 childOb 如果当前对象的值 为object类型 则进行observe 主要为了应对需要进行$set之类的操作 以上的__ob__ this.dep均为这些操作提供帮助
        - 收集依赖部分 defineReactive get Dep调用depend方法把当前watcher加入到dep中 同时childOb存在的话 childOb.dep 即this.dep 也要执行depend方法
        - 通知部分 defineReactive set Dep调用notify 方法通知watcher进行更新 同时 如果set值也是对象 则对其进行observe
3. 目录 vue/src/core/observer/dep.js
    - 新建一个Dep.target 用来存放当前watcher 相当于一个全局变量中间件 创建subs 用来写存放对应的watcher
    - depend 调用Dep.target.addDep(this) 存放当前的dep
    - addSub this.subs.push对应watcher
    - notify 遍历subs 并调用内部每个相关watcher的update
4. 目录 vue/src/core/observer/watcher.js
    - addDep 当传入dep时候 触发 该dep的addSub时间 将watcher插入到dep中
    - update 执行queueWatcher 将当前watcher传入 即开始异步批量更新 详情见异步批量更新
    - run 在批量更新之后 调用run 将当前的实例 以及新旧值传入 触发callback vnode渲染以及diff算法 详情见vnode渲染



#### 异步批量更新
1. watcher响应式数据时 调用queueWatcher
2. queueWatcher 声明全局变量queue 用来存放相应watcher的dep 内部做去重 根据wathcer_id防止相同watcher入队 最后调用nextTick函数 引入并传入renderQueue方法
3. nextTick 创建全局变量callbacks 并把传入的renderQueue push到callbacks里 然后调用timerFn
4. 引入方法renderCallbacks timerFn内部返回一个函数 函数内部执行一个Promise.reslove().then(renderCallbacks) 将renderCallbacks压入微队列最后等待执行
5. renderCallbacks方法遍历callbacks 执行callbacks内部的参数renderQueue方法
6. renderQueue内部将全局变量queue拿出进行遍历 调用queue内部watcher的update方法 完成数据更新
7. 在微队列清空以后页面重新刷新 至此批量更新渲染完成



#### vnode渲染
> diff 直观是在对比真实的DOM树 和 VDOM树 其实在实现中 对比的是新的vnode和旧的vnode 但旧的vnode上el挂载真实DOM 并且旧的vnode和真实DOM顺序一致 所以操作oldNode.el 就是在操作真实DOM
1. watcher执行时 调用watcher.run()
2. watcher内部调用 mountComponent中的update(render()) 并且这个函数在初始mount挂载时也会执行 详请见下vue文件初始化渲染过程
3. render根据数据生成虚拟vnode树
4. update会调用vm._path_ 即path方法
    1. 首先判断有没有oldVnode mount挂载时 界面中是没有vnode 直接调用createElm不走diff算法 这里可理解为初始化生成真实dom树 之后替换掉界面中存在的dom
    2. 再次渲染时首先判断oldVnode是否是真实dom 是的话将转化为虚拟dom 即vnode
    3. 如果oldVnode是虚拟dom 并且和newVnode key值等相同 即同一个vnode 则进入vnode patch比较 调用patchVnode
5. patchVnode执行时正式进入新旧vnode对比模式 即diff 并且在diff前会先判断文本节点还是元素节点 文本节点直接diff 元素节点会找有没有子节点 有的话对比子节点
    1. 如果新旧vnode均有子节点 则调用updateChildren() 进行对比计算
    2. 如果只有新vnode有子节点 则在旧vnode中追加
    3. 如果只有旧vnode有子节点 则直接干掉这些节点
6. 进入updateChildren后新旧vnode头尾各创建两个指针 newStartIndex newEndIndex oldStartIndex oldEndIndex
7. 开始while循环 当newStartIndex > newEndIndex || oldStartIndex > oldEndIndex 跳出循环 以下以ov代替oldVnode nv代替newNode nsi nei osi oei 代替指针
    1. ov[osi] === nv[nsi] 直接替换的vnode    osi nsi 指针后移
    2. ov[oei] === nv[nsi] ov[oei] 位置移到最前 替换    osi nsi 指针后移
    3. ov[osi] === nv[nei] ov[osi] 位置一到最后 替换  nei oei 指针前移
    4. ov[oei] === nv[nei] 直接替换的vnode    nei oei 指针前移
    5. 如果以上四种基础情况均未找到 只能开始遍历nv节点循环查找ov节点 ovi nvi 代表找到的节点
        1. ovi === nvi 将nvi移到对前面 替换     osi nsi 指针后移
        2. ovi 没有找到 插入到nvi第一个    osi nsi 指针后移
8. 跳出while之后 对比nsi nei osi oei
    1. nsi < nei nv比较长 将最后的vnode 追加到 ov
    2. 反之 osi < oei ov比较长 将最后的vnode干掉
9. 至此diff对比结束 以上这些操作均在微队列中进行 vnode 边diff边替换 最后统一刷新


#### 补充Array
> 目录 vue/src/core/observer/array.js
1. 创建一个变量 arrayProto 保存数组方法
2. arrayMethods = Object.create(arrayProto) 拷贝一份
3. 创建一个数组表示常用数组方法
4. 循环该数组 arrayMethods覆盖原数组上继承过来的方法
    - 首先执行原方法 const result = arrayProto[method].apply(this, args)
    - 然后利用 __ob__ 发送 dep上的notify方法 通知数组更新
    - 返回result 返回数组方法 完成覆盖
    
ps: 后续这些功能会在代码中逐步补充
