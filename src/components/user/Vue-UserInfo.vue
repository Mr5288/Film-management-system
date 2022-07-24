<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>信息查询</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 个人信息区 -->
    <div class="userInfoContiner">
      <div class="userInfoBox">
        <div class="userPic">
          <img :src="userInfo.user_pic" alt="">
        </div>
        <div class="userInfo">
          <ul>
            <li>用户名：{{userInfo.username}}</li>
            <li>性别：{{userInfo.sex}}</li>
            <li>出生日期：{{userInfo.birthday}}</li>
            <li>电子邮箱：{{userInfo.email}}</li>
            <li>联系电话：{{userInfo.phone}}</li>
          </ul>
          <div class="edit" @click="editUserInfos">编辑></div>
        </div>
      </div>
      <div class="userMemo">
        预留
      </div>
    </div>
    <!-- 修改个人信息的对话框 -->
    <el-dialog title="修改个人信息" :visible.sync="editDialogVisible" width="30%" :close-on-click-modal="false" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="value" placeholder="请选择性别" style="width:100%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-input v-model="editForm.birthday"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    // 验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) return callback()
      return callback(new Error('邮箱不合法'))
    }
    // 验证手机号规则
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) return callback()
      return callback(new Error('手机号不合法'))
    }
    return {
      options: [{
        value: '1',
        label: '男'
      }, {
        value: '0',
        label: '女'
      }],
      value: '',
      editForm: {},
      editDialogVisible: false,
      editFormRules: {
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    async getAdminInfo () {
      const { data: res } = await this.$http.get('admininfo')
      if (res.status !== 0) return this.$message.error('获取信息失败')
    },
    editUserInfos () {
      this.editDialogVisible = true
      this.editForm = this.$store.state.userInfo
      this.value = this.$store.state.userInfo.sex
    },
    // 监听修改用户对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的请求
        const { data: res } = await this.$http({
          method: 'post',
          url: 'updateadmin',
          data:
            this.Qs.stringify({
              sex: this.editForm.sex,
              birthday: this.editForm.birthday,
              email: this.editForm.email,
              phone: this.editForm.phone,
              id: this.editForm.id
            })
        })
        if (res.status !== 0) return this.$message.error('更新个人信息失败！')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getAdminInfo()
        // 提示修改成功
        this.$message.success('更新个人信息成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.userInfoContiner {
  display: flex;
  justify-content: space-between;
  .userInfoBox {
    width: 400px;
    height: 500px;
    margin-right: 35px;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 10px #ddd;
    background-color: #fff;
    .userPic {
      width: 100%;
      height: 200px;
      padding-top: 30px;
      border-bottom: 1px solid #949494;
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 0 auto;
        background-color: cadetblue;
      }
    }
    .userInfo {
      margin-top: 30px;
      font-size: 18px;
      color: #949494;
      li {
        margin: 15px 25px 0;
      }
      .edit {
        cursor: pointer;
        margin: 20px 0 0 300px;
        font-size: 15px;
        color: #409eff;
      }
    }
  }
  .userMemo {
    flex: 1;
    border-radius: 10px;
    box-shadow: 0 5px 10px #ddd;
    background-color: #fff;
    font-size: 50px;
    line-height: 500px;
    text-align: center;
  }
}
</style>
