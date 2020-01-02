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

export default {
    methods: {
        // 向上寻找父级元素
        dispath(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options._componentTag;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options._componentTag;
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