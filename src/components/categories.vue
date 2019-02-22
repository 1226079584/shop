<template>
  <el-card>
    <breadcrumb data1="商品管理" data2="商品列表"></breadcrumb>
    <el-button @click="addCategories()" class="btn" type="primary" plain>添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="checkList" style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">{{ scope.row.cat_deleted ? '无效' : '有效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="editRole(scope.row)" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="delRole(scope.row)" plain type="danger" icon="el-icon-delete" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加提示文本框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleBoy">
      <el-form :model="formdata" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="formdata.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleBoy = false">取 消</el-button>
        <el-button type="primary" @click="surecheck()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElTreeGrid from "element-tree-grid";
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      pagenum: 1,
      pagesize: 2,
      total: -1,
      checkList: [],
      dialogFormVisibleBoy: false,
      formdata: {
          cat_pid:'',
          cat_name: '',
          cat_level: ''
      },
      options: [],
      selectedOptions: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
      handleChange() {

      },
    async surecheck() {
        if (this.selectedOptions.length === 0) {
        this.formdata.cat_pid = 0
        this.formdata.cat_level = 0
      } else if (this.selectedOptions.length === 1) {
        this.formdata.cat_pid = this.selectedOptions[0]
        this.formdata.cat_level = 1
      } else if (this.selectedOptions.length === 2) {
        this.formdata.cat_pid = this.selectedOptions[1]
        this.formdata.cat_level = 2
      }

      const res = await this.$axios.post(`categories`,this.formdata)
      console.log(res)
      const {meta,data} = res.data
        if(meta.status === 201) {
            this.dialogFormVisibleBoy = false;
            this.getTableData();
            this.$message.success(meta.msg)
            this.formdata = ''
        }
    },
    async getTableData() {
      const res = await this.$axios.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const { meta, data } = res.data;
      if (meta.status === 200) {
        this.total = data.total;
        this.checkList = data.result;
      }
    },
    // 设置每页多少数据
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.getTableData();
    },
    // 当前页码
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.getTableData();
    },
    async addCategories() {
      this.dialogFormVisibleBoy = true;
      const res = await this.$axios.get(`categories?type=2`);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.options = data;
      }

    }
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
