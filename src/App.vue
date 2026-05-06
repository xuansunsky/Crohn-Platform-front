<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import BackgroundMusic from './components/BackgroundMusic.vue'

export default {
  name: 'App',
  components: {
    BackgroundMusic
  }
}
</script>

<style>
</style>