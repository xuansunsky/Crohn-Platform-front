<template>
  <div id="app">
    <router-view />

    <BackgroundMusic />
  </div>
</template>

<script>
// 【关键点 2】引入你刚才写的组件
// 假设你把 BackgroundMusic.vue 放在了 src/components/ 目录下
import BackgroundMusic from './components/BackgroundMusic.vue';

export default {
  name: 'App',
  components: {
    // 【关键点 3】注册组件，告诉 Vue 我要用它
    BackgroundMusic
  }
}
</script>

<style>
/* 你原来的样式 */
</style>