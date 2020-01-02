<template>
    <div>
        <label v-text="label"></label>
        <slot></slot>
        <p v-if="error" v-text="error"></p>
    </div>
</template>

<script>
    import Schema from 'async-validator';
    import Emmit from '@/utils/mixin/emmit';
    export default {
        name: 'KFormItem',
        inject: ['form'],
        mixins: [Emmit],
        props: {
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String,
                default: ''
            }
        },
        data() {
            // console.log(this.form);
            return {
                error: ''
            }
        },
        mounted() {
            this.$on('input-validate', () => {
                this.validate();
            })

            this.dispath('KForm', 'form-item-validate', this);
        },
        methods: {
            validate() {
                const value = this.form.model[this.prop];
                const rules = this.form.rules[this.prop];

                const desc = { [this.prop]: rules };

                const schema = new Schema(desc);

                return schema.validate({ [this.prop]: value }, errors => {
                    if (errors) {
                        this.error = errors[0].message;
                    } else {
                        this.error = '';
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>