<template>
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs">
</template>

<script>
    import Emitter from '@/utils/mixin/emitter';
    export default {
        mixins: [Emitter],
        props: {
            value: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            }
        },
        methods: {
            onInput(e) {
                this.$emit('input', e.target.value);
                this.dispatch('KFormItem', 'input-validate');
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>