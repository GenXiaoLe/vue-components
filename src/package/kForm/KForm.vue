<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'KForm',
        provide() {
            return {
                form: this
            }
        },
        props: {
            model: {
                type: Object,
                required: true,
                default: () => ({}),
            },
            rules: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                fields: []
            }
        },
        methods: {
            validate(callback) {
                let valids = this.fields
                    .filter(child => child.prop)
                    .map(child => child.validate());

                Promise.all(valids)
                    .then(() => callback(true))
                    .catch(() => callback(false))

            }
        },
        created() {
            this.$on('form-item-validate', function(field) {
                this.fields.push(field);
            });
        }
    }
</script>

<style lang="scss" scoped>

</style>