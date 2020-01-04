<template>
    <div>
        this is about page
        <p @click="add">{{$Store.state.counter}}</p>
        <p @click="asyncAdd">{{$Store.state.counter}}</p>
    </div>
</template>

<script>
    export default {
        methods: {
            add() {
                this.$Store.commit('ADD');
            },
            asyncAdd() {
                this.$Store.dispatch('update');
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>