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
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="editUser(scope.row)" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="delUser(scope.row)" plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button
              @click="checkBoy(scope.row)"
              plain
              type="success"
              icon="el-icon-check"
              circle
            ></el-button>
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
    <!-- 添加用户文本框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleadd">
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
        <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户文本框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="right" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色文本框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleBoy">
      <el-form :model="formdata">
        <el-form-item label="用户名">{{currUser}}</el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <!-- v-for -->
            <el-option v-for="(item) in roles" :key="item.id" :value="item.id" :label="item.roleName"></el-option>
          </el-select>
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
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisibleadd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleBoy: false,
      roles: [],
      selectVal: -1,
      //添加用户请求体
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      currUser: '',
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //获取列表数据
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
    //设置每页多少数据
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.getTableData();
    },
    //当前页码
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.getTableData();
    },
    //搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    //清除文本框内容后
    getdata() {
      this.getTableData();
    },
    // 点击显示添加对话框
    showdialog() {
      this.formdata = {};
      this.dialogFormVisible = true;
    },
    //点击添加用户
    async sureAdd() {
      this.dialogFormVisible = false;
      const res = await this.$axios.post(`users`, this.formdata);
      const { meta } = res.data;
      console.log(meta);
      if (meta.status === 201) {
        this.getTableData();
        this.$message.success(meta.msg);
        this.pagenum = 1;
      }
    },
    //改变用户状态
    async changeState(user) {
      console.log(user);
      const res = await this.$axios.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const { meta } = res.data;
      console.log(meta);
      if (meta.status === 200) {
        this.$message.success("修改成功");
      }
    },
    //删除用户
    delUser(user) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.pagenum = 1;
            this.$message.success(msg);
            this.getTableData();
            this.$message.success(msg);
          }
        })
        .catch(() => {
          this.$message.info(msg);
        });
    },
    //点击显示修改对话框
    async editUser(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$axios.get(`users/${user.id}`);
      console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.formdata = data;
      }
    },
    //点击确认修改用户信息
    async sureEdit() {
      const res = await this.$axios.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(res)
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
        this.$message.success(meta.msg);
      }
    },
    //点击显示分配对话框
    async checkBoy(user) {
      this.currUserId = user.id
      this.currUser = user.username
      this.dialogFormVisibleBoy = true;
      const res = await this.$axios.get(`roles`);
      const { data, meta } = res.data;
      // console.log(data);
      if (meta.status === 200) {
        this.roles = data;
      }

      const res2 = await this.$axios.get(`users/${user.id}`)
      console.log(res2)
      this.selectVal = res2.data.data.rid
    },
    //分配
    async surecheck() {
      this.dialogFormVisibleBoy = false
      const res = await this.$axios.put(`users/${this.currUserId}/role`,{rid: this.selectVal})
      const {data,meta} = res.data
      if(meta.status === 200) {
        this.$message.success(meta.msg)
      }
      console.log(res)
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
