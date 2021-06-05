<template>
  <div id="container" ref="container">
    <slot></slot>
  </div>
</template>
<script>
import pannellum from "@/lib/pannellum.js";
export default {
  name: "pannellum",
  props: {
    config: Object,
  },
  data(){
    return {
      viewer: null
    }
  },
  watch: {
    config() {
      let config = this.config
      if(typeof config === 'object') {
        if ("title" in config) document.title = config.title;
        if(this.viewer) this.viewer.destroy()
        config.escapeHTML = true;
        this.viewer = pannellum.viewer(this.$refs.container, config);
        this.$emit('ready', this.viewer)
      }
    }
  },
  mounted() {

  },
  methods: {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
#container {
  width: 100%;
  height: 100%;
}
</style>
