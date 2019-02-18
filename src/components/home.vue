<template>
  <el-container class="boxbox">
    <!-- 头部 -->
    <el-header class="head">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple mid">
            <h1>电商后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple right">
            <a href="#" @click="loginout()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边导航 -->
      <el-aside width="200px" class="aside">
        <el-menu default-active="1" class="el-menu-vertical-demo" unique-opened router>
          <!-- 用户管理 -->
          <el-submenu  :index="val.order+''" v-for="val in data" :key="val.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{val.authName}}</span>
            </template>
            <el-menu-item :index="val2.path" v-for="val2 in val.children" :key="val2.id">
              <i class="el-icon-menu"></i>
              {{val2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  beforeMount () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  created() {
    this.getNav()
  },
  methods: {
    async getNav() {
      const res = await this.$axios.get(`menus`)
      const {data,meta} = res.data
      if(meta.status === 200) {
        this.data = data
      console.log(data)
      }
    },
    // 退出登录
    loginout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('退出成功')
    }
  }
}
</script>

<style>
.head {
  background-color: #b3c0d1;
}
.main {
  background-color: gray;
}
.boxbox {
  height: 100%;
}
.mid {
  text-align: center;
  line-height: 60px;
}
.right {
  text-align: center;
  line-height: 60px;
}
.right a {
  text-decoration: none;
  font-size: 20px;
  color: #fff;
}
</style>
