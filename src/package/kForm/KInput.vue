<template>
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs">
</template>

<script>
    import Emmit from '@/utils/mixin/emmit';
    export default {
        mixins: [Emmit],
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
                this.dispath('KFormItem', 'input-validate');
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>