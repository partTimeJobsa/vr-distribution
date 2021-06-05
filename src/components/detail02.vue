<template>
  <div @click="click">
    <span>{{title}} - <b style="color: yellow">巡检异常</b></span>
    <p>
      <video
        controls="controls"
        controlsList='nodownload noremote footbar' 
        src="https://zhuhai.seeenergy.cn/live/movie5/index.m3u8"
        width="300"
        autoplay="autoplay"
        loop="loop"
        :id="'player' + data.id"
    >
    </video>
    </p>
    <p class="btn-bar">
      <a data-id="1" class="detail" @click.stop="click">详情</a>
    </p>
  </div>
</template>
<script>
/* eslint-disable */
import '@/lib/video/ezuikit'
export default {
  name: "detail02",
  props: {
    data: Object
  },
  data() {
    return {
      viewer: null,
      title: 'title'
    };
  },
  watch: {
    data() {},
  },
  mounted() {
    this.$nextTick(this.palyCamera.bind(this))
    this.title = this.data.title
  },
  methods: {
    palyCamera() {
      let id = "player" + this.data.id
      let player = new EZUIPlayer(id);
      player.on('error', function(){
          console.log('error');
      });
      player.on('play', function(){
          console.log('play');
      });
      player.on('pause', function(){
          console.log('pause');
      });
    },
    click(e) {
      this.$emit("click", e)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
video::-webkit-media-controls-mute-button { display: none !important;}
video::-internal-media-controls-overflow-button{ display: none !important;}
</style>
