<template>
  <div @click="click">
    <span>{{title}}</span>
    <div style="width: 300px;
    white-space: pre-wrap;
    text-align: left;
    text-indent: 2em;
    margin: 10px 0;
    line-height: 25px;">
      珠海项目配电线路图二次接线图包括：共4条进线，安装三相电表108个电表，其中多功能电能表6块，普通电能表102块,供电局进行部门区域用电计量要求楼层配电支路轨道安装单相电表504块，轨道安装三相带互感器电表63块(带189块互感器)。
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "detail04",
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
