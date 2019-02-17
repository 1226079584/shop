<template>
  <el-card>
    <breadcrumb data1="权限管理" data2="角色列表"></breadcrumb>
    <el-button class="butt">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="100px"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" >
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
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取列表数据
    async getTableData () {
      const res = await this.$axios.get(`roles`)
      // console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.tableData = data
      }
    },
    // 编辑用户信息
    editUser () {
      console.log(123)
    },
    // 删除用户
    delUser () {
      console.log(123)
    },
    // 修改用户权限
    checkBoy () {
      console.log(123)
    }
  }
}
</script>

<style>
.butt {
  margin-top: 20px;
}
</style>
