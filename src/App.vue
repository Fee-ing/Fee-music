<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  min-width: 800px;
  color: #333;
  font-size: 15px;
  overflow: hidden;
  background-color: #f0f0f0;
  .music-wrapper{
    height: 100%;
    .music-heading{
      position: fixed;
      width: 100%;
      min-width: 800px;
      height: 60px;
      z-index: 100;
    }
    .music-content{
      position: relative;
      width: 800px;
      height: 100%;
      overflow: hidden;
      margin: 0 auto;
      padding-top: 60px;
    }
  }
}
</style>