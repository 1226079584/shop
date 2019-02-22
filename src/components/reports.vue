<template>
  <el-card class="box">
    <breadcrumb data1="数据统计" data2="数据报表"></breadcrumb>
    <div id="main" style="width: 1000px;height:600px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
    mounted () {
        this.getList();
    },
  methods: {
    async getList() {
      const myChart = echarts.init(document.getElementById("main"));
      const res = await this.$axios.get(`reports/type/1`)
      console.log(res)
      const {meta,data} = res.data
      const option1 = data
      // 指定图表的配置项和数据
      const option2 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      };
        const option = {...option1,...option2}
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
