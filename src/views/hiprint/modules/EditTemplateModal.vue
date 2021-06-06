<template>
  <a-modal
    :title="isEdit ? '编辑' : '新增' + '打印模板'"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    okText="保存"
    cancelText="取消"
    @ok="handleSubmit"
    @cancel="handleCancel"
    class="limitHeightModal"
  >
    <a-spin :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline">
          <a-row>
            <a-col :sm="24" :xs="24">
              <a-form-item label="模板编码">
                <a-input
                  :disabled="isEdit"
                  v-decorator="[
                    'templateSign',
                    {
                      initialValue: form.templateSign,
                      rules: [
                        { required: true, message: '请输入模板编码' },
                        { validator: checkTemplateSign },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :xs="24">
              <a-form-item label="模板名称">
                <a-input
                  v-decorator="[
                    'templateName',
                    {
                      initialValue: form.templateName,
                      rules: [{ required: true, message: '请输入模板名称' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :xs="24">
              <a-form-item label="模板授权"> </a-form-item>
              <project-tree
                ref="projectTree"
                :checkable="true"
                :showSearch="false"
                :checkStrictly="false"
                :updateSelectedKeys="projectIds"
                :templateSign="templateSign"
                @trigerTableRefresh="triggerTableRefresh"
              />
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import AFormItem from "ant-design-vue/es/form/FormItem";
import ProjectTree from "@/components/ProjectTree/index";
// import { addAndEditPrintTemplate } from '@/api/printTemplate'

export default {
  name: "EditTemplateModal",
  components: {
    AFormItem,
    ProjectTree,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isEdit: false,
      projectIds: [],
      recordId: null,
      templateJson: null,
      isDisable: false,
      templateSign: null,
    };
  },
  methods: {
    add(templateJson, record) {
      if (record) {
        this.isEdit = true;
        this.recordId = record.id;
        this.projectIds = record.projectIds;
        this.templateSign = record.templateSign;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            templateSign: record.templateSign,
            templateName: record.templateName,
          });
        });
      } else {
        this.isEdit = false;
        this.recordId = null;
        this.projectIds = [];
        this.templateSign = null;
        this.$nextTick(() => {
          this.form.resetFields();
        });
      }
      this.templateJson = templateJson;
      this.visible = true;
    },
    //   handleSubmit() {
    //     this.form.validateFields((err, values) => {
    //       if (!err) {
    //         let _self = this;
    //         _self.isDisable = true;
    //         setTimeout(() => {
    //           _self.isDisable = false
    //         }, 1000);
    //         _self.confirmLoading = true;
    //         addAndEditPrintTemplate(Object.assign(values, {
    //           id: _self.recordId,
    //           projectIds: _self.projectIds,
    //           templateJson: this.templateJson
    //         }))
    //           .then(res => {
    //             if (res.resp_code === 0) {
    //               _self.visible = false;
    //               _self.$emit('ok');
    //               _self.$message.success('操作成功！');
    //             } else {
    //               _self.$message.error(res.resp_msg || '操作失败！');
    //             }
    //             _self.confirmLoading = false;
    //           })
    //           .catch(err => {
    //             _self.$message.error(err.message || '操作失败！');
    //             _self.confirmLoading = false;
    //           })
    //       }
    //     })
    //   },
    //   handleCancel() {
    //     this.visible = false;
    //     this.confirmLoading = false;
    //   },
    //   triggerTableRefresh(selectedKeys) {
    //     debugger
    //     if(selectedKeys){
    //       this.projectIds = []
    //       selectedKeys.forEach(element => {
    //         this.projectIds.push(element.id)
    //       })
    //     }
    //     // this.projectIds = selectedKeys ? selectedKeys : [];
    //   },
    //   checkTemplateSign(rule, value, callback) {
    //     let reg =  /^[0-9a-zA-Z]*$/;
    //     if (value && !reg.test(value)) {
    //       callback(new Error('请输入由数字及字母组成的模板编码！'))
    //     }
    //     callback();
    //   },
  },
};
</script>

<style scoped>
.table-page-search-wrapper {
  padding: 10px 20px;
}
</style>
