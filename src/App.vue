<template>
  <div id="app">
    <Form />
  </div>
</template>

<script>
import Form from './pages/form';
export default {
  name: 'app',
  components: {
    Form
  },
  data() {
    return {
      //
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
