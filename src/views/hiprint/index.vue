<template>
  <template-content
    :template="template"
    @ok="handleSaveOk"
    @change="handleTemplateChange"
  />
</template>

<script>
import TemplateContent from "./modules/TemplateContent";
// import { addAndEditPrintTemplate } from '@/api/printTemplate'

export default {
  components: {
    TemplateContent,
  },
  data() {
    return {
      template: null,
    };
  },
  methods: {
    // handleSidebarChange(template) {
    //   this.template = template;
    // },
    // handleTemplateChange(template) {
    //   let _self = this;
    //   addAndEditPrintTemplate(Object.assign(template, {
    //     templateName: this.template.templateName
    //   }))
    //     .then(res => {
    //       if (res.resp_code === 0) {
    //         _self.$message.success('操作成功！');
    //         _self.$refs.TemplateSidebar.refresh();
    //       } else {
    //         _self.$message.error(res.resp_msg || '操作失败！');
    //       }
    //     })
    //     .catch(err => {
    //       _self.$message.error(err.message || '操作失败！');
    //     })
    // },
    // handleSaveOk() {
    //   this.$refs.TemplateSidebar.refresh();
    // }
  },
};
</script>

<style lang="less">
.print-template {
  .hiprint-printPaper.design {
    width: 100% !important;
  }
  .ant-card-body {
    padding: 0 24px;
    > .ant-row > .ant-col-7,
    > .ant-row > .ant-col-17 {
      padding: 24px 0;
    }
  }
  .table-operator {
    text-align: right;
    margin: 0 !important;
    .ant-btn {
      color: #5e7fb3 !important;
      background-color: transparent !important;
      border: 0;
      box-shadow: none;
      i {
        color: #5e7fb3;
      }
      &:hover {
        span {
          color: #5e7fb3;
        }
      }
      &[disabled="disabled"] {
        i {
          color: rgba(0, 0, 0, 0.25);
        }
        span {
          color: rgba(0, 0, 0, 0.25);
        }
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
.print-template.default-card::before {
  left: 29% !important;
}
</style>
