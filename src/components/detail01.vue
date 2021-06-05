<template>
  <div @click="click">
    <span>{{title}} - 巡检正常</span>
    <table id="hor-minimalist-b">
      <tr>
        <th>参数</th>
        <th align="right">参数值</th>
      </tr>
      <tr>
        <td>有功功率</td>
        <td align="right">10.96</td>
      </tr>
      <tr>
        <td>功率因数</td>
        <td align="right">0.96</td>
      </tr>
      <tr>
        <td>A相电流</td>
        <td align="right">222.83/20.8</td>
      </tr>
      <tr>
        <td>B相电流</td>
        <td align="right">223.21/22</td>
      </tr>
      <tr>
        <td>C相电流</td>
        <td align="right">222.93/14.8</td>
      </tr>
    </table>
    <p class="btn-bar">
      <a data-id="1" class="detail" @click.stop="click">详情</a>
    </p>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "detail01",
  props: {
    data: Object,
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
    this.title = this.data.title
  },
  methods: {
    click(e) {
      this.$emit("click", e)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
