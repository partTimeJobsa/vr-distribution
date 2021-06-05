<template>
  <div id="video" v-show="visible">
    <div class="wrapper">
      <span class="view3d-hs-close video-close" @click="close"></span>
      <h3 class="view3d-hs-title">预警详情</h3>
      <div style="width: 100%; overflow-y: auto">
        <video
            controls="controls"
            src="movie.ogv"
            width="100%"
            autoplay="autoplay"
        >
        </video>
        <table id="newspaper-c" summary="Personal Movie Rating">
          <thead>
            <tr>
                <th colspan="2" scope="col">
                  <p>视在功率</p>
                  <p>13</p>
                </th>
                <th colspan="2" scope="col">
                  <p>有功功率</p>
                  <p>10.96</p>
                </th>
                <th colspan="3" scope="col">
                  <p>无功功率</p>
                  <p>-4.88</p>
                </th>
              </tr>
          </thead>
          <tbody>
            <tr>
              <th colspan="6">
                <p>电压V/电流A</p>
              </th>
            </tr>
            <tr>
              <th scope="col" colspan="2">
                <p>A相</p>
              </th>
              <th scope="col" colspan="2">
                <p>B相</p>
              </th>
              <th scope="col" colspan="2">
                <p>C相</p>
              </th>
            </tr>
            <tr>
              <th scope="col" colspan="2">
                <p>222.83/20.8</p>
              </th>
              <th scope="col" colspan="2">
                <p>223.21/22</p>
              </th>
              <th scope="col" colspan="2">
                <p>222.93/14.8</p>
              </th>
            </tr>
            <tr>
              <th colspan="6">
                <p>母排温度</p>
              </th>
            </tr>
            <tr>
              <th scope="col" colspan="2">
                <p>A相</p>
              </th>
              <th scope="col" colspan="2">
                <p>B相</p>
              </th>
              <th scope="col" colspan="2">
                <p>C相</p>
              </th>
            </tr>
            <tr>
              <th scope="col" colspan="2">
                <p>21.7</p>
              </th>
              <th scope="col" colspan="2">
                <p>21.7</p>
              </th>
              <th scope="col" colspan="2">
                <p>21.7</p>
              </th>
            </tr>
            <tr>
              <th colspan="6">
                <p>柜内</p>
              </th>
            </tr>
            <tr>
              <th scope="col" colspan="3">
                <p>温度℃</p>
              </th>
              <th scope="col" colspan="3">
                <p>湿度%</p>
              </th>
            </tr>
            <tr>
              <th scope="col" colspan="3">
                <p>23.97</p>
              </th>
              <th scope="col" colspan="3">
                <p>50.16</p>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import '@/lib/video/ezuikit'
export default {
  name: "video",
  props: ['show'],
  data() {
    return {
      visible: false
    };
  },
  watch: {
    show() {
      this.visible = this.show
    },
  },
  mounted() {
  },
  methods: {
    close(e) {
      this.$emit("close")
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
