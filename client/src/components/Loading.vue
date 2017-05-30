<template>
<div class="loading-box">
  <mu-circular-progress :size="30" color="blue"/>
  <span class="text">loading</span>
</div>
</template>

<script>
export default {
}
</script>

<style>
.loading-box {
  text-align: center;
  margin: 20px 0;
}
.loading-box .text {
  display: inline-block;
  vertical-align: top;
  font-size: 16px;
  height: 30px;
  line-height: 32px;
  margin-left: 5px;
}
</style>
