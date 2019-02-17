<template>
  <el-card>
    <breadcrumb data1="权限管理" data2="权限列表"></breadcrumb>
    <el-table
      :data="tableData"
      highlight-current-row
      height="800px"
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column property="authName" label="权限名称"></el-table-column>
      <el-table-column property="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
      this.getTableData()
  },
  methods: {
      handleCurrentChange(val) {
          console.log(val)
      },
      //获取数据
      async getTableData() {
          const res = await this.$axios.get(`rights/list`)
          console.log(res)
          const {data,meta} = res.data
          if(meta.status === 200) {
              this.tableData = data
          }
      }
  }
};
</script>

<style>
</style>
