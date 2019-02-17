<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{data1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{data2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props: ['data1', 'data2']
}
</script>

<style>

</style>
