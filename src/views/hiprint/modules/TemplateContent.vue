<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="48">
        <a-col :md="4" :sm="24">
          <a-form-item label="文本">
            <div class="ep-draggable-item" tid="testModule.text">
              <a-icon type="font-size" />
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-form-item label="表格">
            <div class="ep-draggable-item" tid="testModule.tableCustom">
              <a-icon type="table" />
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-form-item label="横线">
            <div class="ep-draggable-item" tid="testModule.hline">
              <a-icon type="line" />
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-form-item label="竖线">
            <div class="ep-draggable-item" tid="testModule.vline">
              <a-icon type="pause" />
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="table-operator">
            <a-popconfirm
              title="是否确定清空？"
              @confirm="clearTemplate"
              v-if="!template"
            >
              <a-button icon="redo">清空</a-button>
            </a-popconfirm>
            <a-button
              icon="setting"
              type="primary"
              @click="editItem"
              :disabled="$buttonPermission('print_edit_stting')"
              >设置</a-button
            >
            <a-button
              icon="save"
              type="primary"
              @click="saveTemplate"
              :disabled="isDisable || $buttonPermission('print_Template_Save')"
              >保存</a-button
            >
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <div class="hiPrint-printTemplate" @contextmenu.prevent></div>
        </a-col>
      </a-row>
    </a-form>

    <!-- <a-modal
      title="属性设置"
      :width="825"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="limitHeightModal"
    >
      <div class="print-element-option-setting"></div>
    </a-modal> -->

    <edit-template-modal ref="EditTemplateModal" @ok="handleEditTemplateOk" />
  </div>
</template>

<script>
import EditTemplateModal from "./EditTemplateModal";

var hiprintTemplate;
var emptyTemplate = {
  panels: [
    {
      index: 0,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 780,
      printElements: [],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
    },
  ],
};

export default {
  name: "TemplateContent",
  props: ["template"],
  components: {
    EditTemplateModal,
  },
  data() {
    return {
      visible: true,
      isDisable: false,
    };
  },
  methods: {
    saveTemplate() {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 1000);
      if (!this.template) {
        this.$refs.EditTemplateModal.add(
          JSON.stringify(hiprintTemplate.getJson())
        );
        return;
      }
      this.$emit("change", {
        id: this.template.id,
        templateJson: JSON.stringify(hiprintTemplate.getJson()),
      });
    },
    clearTemplate() {
      hiprintTemplate.clear();
    },
    handleEditTemplateOk() {
      this.$emit("ok");
    },
    // editItem() {
    //   if ($('.print-element-option-setting').html()) {
    //     this.visible = true
    //     this.$nextTick(() => {
    //     document.getElementsByClassName('hiprint-option-item-submitBtn')[0].addEventListener('click', () => {
    //       this.visible = false
    //     })
    //     document.getElementsByClassName('hiprint-option-item-deleteBtn')[0].addEventListener('click', () => {
    //       this.visible = false
    //     })
    //   })
    //   } else {
    //     this.$message.warning('请选中一个模板元素！')
    //   }

    // },
    // handleCancel() {
    //   this.visible = false
    // }
  },
  // created() {
  //   this.visible = true
  // },
  mounted() {
    //初始化打印插件
    hiprint.init({
      providers: [new customElementTypeProvider()],
    });

    //hiprint.PrintElementTypeManager.build('.hiprintEpContainer', 'testModule');
    //设置左侧拖拽事件
    hiprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));
    this.$nextTick(() => {
      hiprintTemplate = new hiprint.PrintTemplate({
        template: emptyTemplate,
        settingContainer: ".print-element-option-setting",
        paginationContainer: ".hiprint-printPagination",
      });
      //打印设计
      hiprintTemplate.design(".hiPrint-printTemplate");
      this.visible = false;
    });
  },
  watch: {
    template(n, o) {
      let templateJson =
        n && n.templateJson ? JSON.parse(n.templateJson) : emptyTemplate;
      hiprintTemplate = new hiprint.PrintTemplate({
        template: templateJson,
        settingContainer: ".print-element-option-setting",
        paginationContainer: ".hiprint-printPagination",
      });
      $(".hiPrint-printTemplate").empty();
      //打印设计
      hiprintTemplate.design(".hiPrint-printTemplate");
    },
  },
};
</script>

<style scoped>
.ep-draggable-item {
  width: 50px;
  height: 32px;
  text-align: center;
  vertical-align: middle;
  border-radius: 6px;
  background: #cccccc;
  box-shadow: 1px 1px 3px #cccccc;
}
.table-operator {
  text-align: center;
}
.hiPrint-printTemplate {
  margin-top: 20px;
  text-align: center;
}
</style>
