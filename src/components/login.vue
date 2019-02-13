<template>
  <div class="warp">
    <el-form class="box" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="login()" class="but" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$axios.post(`login`, this.formdata)
      .then(res => {
        const {data: {
            data,meta:{msg,status}
        }} = res
        if(status === 200){
            this.$router.push({
                name: 'home'
            })
        }else {
            this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<style>
.warp {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}
.box {
    width: 500px;
    padding: 40px;
    background-color: #fff;
    border-radius: 8px;
}
.but {
    width: 100%;
}
</style>
