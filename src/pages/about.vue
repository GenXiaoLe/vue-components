<template>
    <div>
        this is about page
        <p @click="add">{{$Store.state.counter}}</p>
        <p @click="asyncAdd">{{$Store.state.counter}}</p>
        <p>{{$Store.getters.dobuleCounter}}</p>
        <div>
        <router-link to="/about/detail1">page1</router-link>
        <span>|</span>
        <router-link to="/about/detail2">page2</router-link>
        </div>
        <router-view></router-view>
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