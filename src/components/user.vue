<template>
  <el-card class="content">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchBox">
      <el-col>
        <el-input
          @clear="getdata()"
          placeholder="请输入内容"
          v-model="query"
          clearable
          class="input-with-select search"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="showdialog()" type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">{{scope.row.create_time | fmdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-row>
            <el-button plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button plain type="success" icon="el-icon-check" circle></el-button>
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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisible: false,
      formdata: {
          username: '',
          password: '',
          email: '',
          mobile: ''
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$axios.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const { data, meta } = res.data;
      //   console.log(data)
      if (meta.status === 200) {
        this.tableData = data.users;
        this.total = data.total;
      }
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.getTableData();
    },
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    getdata() {
      this.getTableData();
    },
    //点击显示添加对话框
    showdialog() {
        this.dialogFormVisible = true
    },
    async sureAdd() {
        this.dialogFormVisible = false
        const res = await this.$axios.post(`users`,this.formdata)
        this.$message.success('添加成功')
        this.getTableData()
    }
  }
};
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.search {
  width: 400px;
}
</style>
