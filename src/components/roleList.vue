<template>
  <el-card>
    <breadcrumb data1="权限管理" data2="角色列表"></breadcrumb>
    <el-button @click="addUser()" class="butt">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">  
          <!-- 一级权限 -->
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="handleClose(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="handleClose(scope.row, item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    @close="handleClose(scope.row, item3.id)"
                    class="level3"
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col>
              <span>暂无权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="100px"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="editRole(scope.row)" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="delRole(scope.row)" plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button
              @click="checkRole(scope.row)"
              plain
              type="success"
              icon="el-icon-check"
              circle
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <!-- Tree 树形控件 -->
      <el-tree
        ref="jdDom"
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="treeOpen"
        :default-checked-keys="treeCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCheck()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleadd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        roleName: "",
        roleDesc: ""
      },
      tableData: [],
      dialogFormVisible: false,
      dialogFormVisibleadd: false,
      dialogFormVisibleEdit: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      treeData: [],
      treeOpen: [],
      treeCheck: [],
      roleId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取列表数据
    async getTableData() {
      const res = await this.$axios.get(`roles`);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.tableData = data;
        // console.log(this.tableData)
      }
    },
    // 编辑用户信息
    editRole() {
      console.log(123);
    },
    // 删除用户
    delRole() {
      console.log(123);
    },
    // 修改用户权限文本框
    async checkRole(role) {
      this.roleId = role.id;
      // console.log(this.roleId);
      this.dialogFormVisible = true;
      const res = await this.$axios.get(`rights/tree`);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.treeData = data;
        this.treeData.forEach(item1 => {
          item1.children.forEach(item2 => {
            this.treeOpen.push(item2.id);
          });
        });
        const arr = [];
        role.children.forEach(val => {
          val.children.forEach(val2 => {
            val2.children.forEach(val3 => {
              arr.push(val3.id);
            });
          });
        });
        this.treeCheck = arr;
      }
    },
    //确认修改权限
    async sureCheck() {
      const jdNum1 = this.$refs.jdDom.getCheckedKeys();
      const jdNum2 = this.$refs.jdDom.getHalfCheckedKeys();
      const jdNum = [...jdNum1, ...jdNum2];
      // console.log(jdNum)
      const res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: jdNum.join(",")
      });
      // console.log(res)
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.dialogFormVisible = false;
        this.getTableData();
      }
    },
    //删除角色权限
    async handleClose(role, rightId) {
      // console.log(role.id,rightId)
      const res = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        role.children = data;
      }
    },
    //添加文本框
    addUser() {
      this.dialogFormVisibleadd = true;
      this.formdata = {}
    },
    //确认添加用户
    async sureAdd() {
      const res = await this.$axios.post(`roles`, this.formdata);
      // console.log(res)
      const { data, meta } = res.data;
      if (meta.status === 201) {
        this.$message.success(meta.msg);
        this.dialogFormVisibleadd = false;
        this.getTableData();
      }
    },
    //修改用户文本框
    async editRole(role) {
      this.roleId = role.id
      this.dialogFormVisibleEdit = true
      const res = await this.$axios.get(`roles/${role.id}`)
      const {data,meta} = res.data
      if(meta.status === 200) {
        this.formdata = data
      }
    },
    //确认修改
    async sureEdit() {
      const res = await this.$axios.put(`roles/${this.roleId}`,this.formdata)
      const {data,meta} =res.data
      if(meta.status === 200) {
        this.dialogFormVisibleEdit = false
        this.$message.success("修改成功")
        this.getTableData();
      } 
    },
    //删除角色
    async delRole(role) {
      const res = await this.$axios.delete(`roles/${role.id}`)
      const {data,meta} = res.data
      if(meta.status === 200) {
        this.$message.success(meta.msg)
        this.getTableData();
      } 
    }
  }
};
</script>

<style>
.butt {
  margin-top: 20px;
}
</style>
