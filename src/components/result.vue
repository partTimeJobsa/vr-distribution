<template>
  <div id="result" v-show="visible">
    <div class="wrapper">
      <a href="https://smart1.seeenergy.cn/VRRoom/vrroom.xlsx" download="vrroom.xlsx" class="download">导出</a>
      <span class="view3d-hs-close result-close" @click="close"></span>
      <h3 class="view3d-hs-title">巡检结果</h3>
      <div style="width: 100%; height: 100%; overflow-y:auto" v-loading="loading">
        <pdf
          v-for="i in numPages"
          :key="i"
          :src="src"
          :page="i"
          style="display: block; width: 100%; margin-bottom: 10px"
        ></pdf>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import pdf from 'vue-pdf'
var loadingTask = pdf.createLoadingTask('vrroom.pdf'); 
export default {
  name: "result",
  props: ['show'],
  components: {
		pdf
	},
  data() {
    return {
      visible: false,
      loading: false,
      src: loadingTask,
      numPages: [],
      currentPage: 0,
			pageCount: 0,
    };
  },
  watch: {
    show() {
      this.visible = this.show
      if(this.show) this.init()
    },
  },
  mounted() {
  },
  methods: {
    init() {
      this.loading = true
      this.src.promise.then(pdf => {
        this.numPages = pdf.numPages;
        this.loading = false
      });
    },
    close(e) {
      this.$emit("close")
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
