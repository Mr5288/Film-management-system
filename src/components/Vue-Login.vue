<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 这是标题区域 -->
      <div class="login_title">管理员登录</div>
      <!-- 这是登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" class="login_password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="密码"></el-input>
          <el-link type="info" class="forget">忘记密码</el-link>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="verification">
          <el-input v-model="loginForm.verification" prefix-icon="el-icon-key" placeholder="验证码"></el-input>
          <div class="verification_box"></div>
        </el-form-item>
        <el-checkbox v-model="checked">记住用户名</el-checkbox>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" class="login_btn" @click="login(),remName()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '000000',
        verification: '0000'
      },
      checked: false,
      // 这是表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名在3到10个字符之间', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码在6到15个字符之间', trigger: 'blur' }
        ],
        // 验证验证码是否正确
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码不能超过4个字符', trigger: 'blur' }
        ]

      }
    }
  },
  mounted () {
    this.getCookie()
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('api/user-login',
          this.Qs.stringify({
            username: this.loginForm.username,
            password: this.loginForm.password
          }))
        if (res.status !== 0) return this.$message.error('登录失败,请检查用户名与密码是否正确')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token)
        this.$router.push('/home')
      })
    },
    remName () {
      if (this.checked === true) { this.setCookie(this.loginForm.username, 7) } else { this.setCookie('', -1) }
    },
    // 设置cookie
    setCookie (username, days) {
      const date = new Date()
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days)// 保存的天数
      // 字符串拼接
      window.document.cookie =
        'username' + '=' + username + ';path=/;expires=' + date.toGMTString()
    },
    // 读取cookie
    getCookie () {
      if (document.cookie.length > 0) {
        const arr = document.cookie.split('; ') // 分割成一个个独立的“key=value”的形式
        for (let i = 0; i < arr.length; i++) {
          const arr2 = arr[i].split('=') // 再次切割，arr2[0]为key值，arr2[1]为对应的value
          if (arr2[0] === 'username') {
            this.loginForm.username = arr2[1]
            this.checked = true
          }
        }
      }
    }
  }
}

</script>

<style lang="less" scoped>
.login_container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 600px;
  min-height: 400px;
  background: url(../../public/img/bg.jpg) round;
}
.login_box {
  width: 520px;
  height: 370px;
  padding: 30px;
  margin-right: 8%;
  border-radius: 3px;
  background: rgba(247, 247, 247, 0.9);

  .login_title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
  }
  .login_password {
    position: relative;
    /deep/ .el-input__inner {
      padding-right: 75px;
    }
    .forget {
      position: absolute;
      right: 15px;
    }
  }
  /deep/ .el-form-item__content {
    display: flex;
    justify-content: space-between;
    .verification_box {
      width: 200px;
      height: 40px;
      border-radius: 4px;
      margin-left: 10px;
      border: 1px solid #cdcdcf;
    }
  }

  /deep/ .el-checkbox {
    margin: 0 0 10px 4px;
  }
  .login_btn {
    width: 100%;
  }
}
</style>
