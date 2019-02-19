<template>
  <el-card>
    <breadcrumb data-1="商品管理" data-2="商品列表"></breadcrumb>
    <el-alert class="tit" title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
    <!-- 步骤进度条 -->
    <el-steps :active="active-0" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs标签 -->
    <el-form ref="form" label-position="top" :model="form" label-width="80px">
      <el-tabs
        v-model="active"
        tab-position="left"
        @tab-click="changeTab"
        style="height: 670px; margin-top: 20px"
      >
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <span class="demonstration"></span>
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="item in this.checkList" :key="item.attr_id">
              <el-checkbox :label="val" v-for="(val,i) in item.attr_vals" :key="i" border :checked="true"></el-checkbox>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="item in this.checkList1" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              :headers="headers"
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button class="add" @click="addgoods()">添加商品</el-button>
            <quillEditor v-model="content"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      // goods_name	商品名称	不能为空
      // goods_cat	以为','分割的分类列表	不能为空
      // goods_price	价格	不能为空
      // goods_weight	重量	不能为空
      // goods_number	数量	不能为空
      // goods_introduce	介绍	可以为空
      // pics	上传的图片临时路径（对象）	可以为空
      // attrs	商品的参数（数组）	可以为空
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //   级联选择器数据源
      options: [],
      selectedOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      checkList: [],
      checkList1: [],
      headers: {
        Authorization: localStorage.getItem("token")
      },
      content: ''
    };
  },
  created() {
    this.getgoods();
  },
  methods: {
    //tab点击事件
    async changeTab() {
      // active=2
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          return this.$message.error("请选择分类!");
        }
        const res = await this.$axios.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(this.selectedOptions)
        // console.log(res);
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.checkList = data;
          this.checkList.forEach(item => {
            item.attr_vals = item.attr_vals.trim().split(",");
          });
        }
      }
      // active=3
      if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          return this.$message.error("请选择分类!");
        }
        const res = await this.$axios.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.checkList1 = data;
        }
      }
    //   console.log(this.checkList)
    //   console.log(this.checkList1)
    },
    handleChange() {},
    //获取基本信息
    async getgoods() {
      const res = await this.$axios.get(`categories?type=3`);
      // console.log(res)
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.options = data;
      }
    },
    handleRemove(file, fileList) {
    //   console.log(file);
      //   file.response.data.tmp_path
      const index = this.form.map( item => {
          return item.pic = file.response.data.tmp_path
      })
      this.form.pics.splice(index,1)
    },
    handleSuccess(response, file, fileList) {
    //   console.log(response);
      //   response.data.tmp_path 
      this.form.pics.push({
          pic:response.data.tmp_path 
      })
    },
    //添加商品
    async addgoods () {
        this.form.goods_introduce = this.content
        const arr1 = this.checkList.map( item => {
            return {attr_id:item.attr_id ,attr_value:item.attr_vals}
        })
        const arr2 = this.checkList1.map( item => {
            return {attr_id:item.attr_id ,attr_value:item.attr_vals}
        })
        this.form.attrs = [...arr1,...arr2]
        this.form.goods_cat = this.selectedOptions.join(',')
        // console.log(this.form.goods_cat)
        console.log(this.form)
        const res = await this.$axios.post(`goods`,this.form)
        const {data,meta} = res.data
        if(meta.status === 201) {
            this.$message.success(meta.msg)
            this.$router.push({
                name: 'goods'
            })
        }
    }
  }
};
</script>

<style>
.tit {
  margin-top: 20px;
  margin-bottom: 20px;
}
.ql-editor,
.ql-blank {
  min-height: 400px;
}
.add {
  margin-bottom: 20px;
}
</style>
