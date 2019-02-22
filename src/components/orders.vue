<template>
  <el-card>
    <breadcrumb data1="订单管理" data2="订单列表"></breadcrumb>

    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">{{scope.row.create_time|fmdate}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showEditdia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="catlist"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChange()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Catlist from "@/assets/city_data2017_element.js";

export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      form: {
        address: ""
      },
      // 级联选择器要绑定的数据

      catlist: [],
      selectedOptions: []

      // defaultProp:{
      //   value:"value",
      //   label:"label",
      //   children:"children"
      // }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    sureChange() {},
    // 获取表格数据
    async getData() {
      const res = await this.$axios.get(`orders?pagenum=1&pagesize=10`);
      console.log(res);
      this.list = res.data.data.goods;
    },
    // 打开对话框

    showEditdia() {
      this.catlist = Catlist;

      this.dialogFormVisible = true;
    }
  }
};
</script>

<style>
</style>
