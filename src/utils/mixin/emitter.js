const boardcast = function (componentName, eventName, params) {
    this.$children.forEach(child => {
        let name = child.$options._componentTag;

        if (componentName === name) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            boardcast.apply(child, [componentName, eventName].concat(params));
        }
    });
}

// dispatch 与 boardcast 在vue1.x中已经实现了, 但是在vue2.x中被废弃掉, element-ui用到这个方法, 于是又实现了一遍
export default {
    methods: {
        // 向上寻找父级元素
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.componentName;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }

            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        // 向下寻找子级元素
        boardcast(componentName, eventName, params) {
            boardcast.call(this, componentName, eventName, params);
        }
    }
};