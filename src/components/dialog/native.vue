<template>
    <div class="box" v-if="isShow">
        <h3 v-text="title"></h3>
        <p class="box-content" v-text="message"></p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            message: {
                type: String,
                default: ''
            },
            duration: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isShow: false
            }
        },
        methods: {
            show() {
                this.isShow = true;
                setTimeout(this.hide, this.duration);
            },
            hide() {
                this.isShow = false;
                this.remove();
            }
        }
    }
</script>

<style scoped>
.box{
    position: fixed;
    width: 100%;
    top: 16px;
    left: 0;
    text-align: center;
    pointer-events: none;
    background: #fff;
    border: gray 3px solid;
    box-sizing: border-box;   
}
.box-content {
    width: 200px;
    margin: 10px auto;
    font-size: 14px;
    padding: 8px 16px;
    background: #fff;
    border-radius: 3px;
    margin-block-start: 8px;
}

</style>