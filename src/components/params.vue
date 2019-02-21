<template>
  <el-card class="box">
    <breadcrumb data1="商品管理" data2="分类参数"></breadcrumb>
    <el-alert class="tit" title="注意:只允许为第三级分类设置参数" type="warning" show-icon :closable="false"></el-alert>
    <span class="demonstration">请选择商品分类</span>
    <el-cascader
      clearable
      expand-trigger="hover"
      :options="options"
      v-model="selectedOptions"
      @change="handleChange"
      :props="defaultProps"
    ></el-cascader>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="1">
        <el-button type="primary" disabled>设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="checkList" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                :key="i"
                v-for="(tag,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" width="100px"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name" width="300px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button
                  @click="editRole(scope.row)"
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button
                  @click="delRole(scope.row)"
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="2">
        <el-button type="primary" disabled>设置静态参数</el-button>
        <!-- 表格 -->
        <el-table :data="checkList1" style="width: 100%">
          <el-table-column type="index" width="100px"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name" width="300px"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals" width="300px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button
                  @click="editRole(scope.row)"
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button
                  @click="delRole(scope.row)"
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //   级联选择器数据源
      options: [],
      selectedOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      activeName: "1",
      checkList: [],
      checkList1: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getgoods();
  },
  methods: {
    handleInputConfirm(val) {
      if (!this.inputValue) {
        return;
      }
      val.attr_vals.push(this.inputValue);
      this.inputValue = "";
      this.inputVisible = false;
    },
    showInput() {
      this.inputVisible = true;
      //   this.$nextTick(_ => {
      //     this.$refs.saveTagInput.$refs.input.focus();
      //   });
    },
    handleClose(tag) {},
    delRole() {},
    editRole() {},
    handleClick() {
        this.getlist()
    },
    handleChange() {
      this.getlist()
    },
    async getgoods() {
      const res = await this.$axios.get(`categories?type=3`);
      //   console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.options = data;
      }
    },
    async getlist() {
        // activeName=1
      if (this.activeName === "1") {
        if (this.selectedOptions.length !== 3) {
          return this.$message.error("请选择分类!");
        }
        const res = await this.$axios.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(this.selectedOptions)
        console.log(res);
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.checkList = data;
          this.checkList.forEach(item => {
            item.attr_vals = item.attr_vals.trim().split(",");
          });
        }
      }
      // activeName=2
      if (this.activeName === "2") {
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
    }
  }
};
</script>

<style>
.tit {
  margin-top: 20px;
  margin-bottom: 20px;
}
.box {
  height: 100%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
