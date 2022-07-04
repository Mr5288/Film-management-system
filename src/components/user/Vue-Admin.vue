<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.username" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">添加管理员</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 管理员列表区 -->
    <el-card style="margin-top:25px">
      <el-table :data="userlist" border stripe :header-cell-style="{'text-align':'center'} " :cell-style="{'text-align':'center'} ">
        <el-table-column label="ID" prop="id" min-width=40px></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="性别" prop="sex"></el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="电子邮箱" prop="email"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="注册时间" prop="creat_time"></el-table-column>
        <el-table-column label="操作" min-width=110px>
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="removeUserById(scope.row.id)">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加管理员对话框 -->
    <el-dialog title="添加管理员" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="管理员名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改管理员的对话框 -->
    <el-dialog title="修改管理员" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="管理员名">
          <el-input v-model="editForm.username" disabled></el-input>
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
        value: '选项1',
        label: ''
      }, {
        value: '选项2',
        label: '男'
      }, {
        value: '选项3',
        label: '女'
      }],
      value: '',
      queryInfo: {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 10, // 每页显示几条数据，默认每页显示10条
        sex: '', // 性别
        username: '' // 管理员名
      },
      userlist: [], // 管理员列表
      total: 0, // 总条数
      addDialogVisible: false, // 控制添加管理员对话框的显示与隐藏
      editDialogVisible: false, // 控制修改管理员对话框的显示与隐藏
      // 添加管理员的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 查询到的管理员信息
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入管理员名', trigger: 'blur' },
          { min: 3, max: 10, message: '管理员名在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码在3到10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
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
  created () {
    this.getUserList()
  },
  methods: {
    // 获取管理员列表事件
    async getUserList () {
      const { data: res } = await this.$http(
        {
          method: 'get',
          url: 'my/article/cates',
          params: this.queryInfo
        })
      if (res.status !== 0) return this.$message.error('获取管理员数据失败!')
      this.userlist = res.data
      this.total = res.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听添加管理员对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加管理员事件
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({
          method: 'post',
          url: 'my/article/adduser',
          data: this.Qs.stringify(this.addForm)
        })
        if (res.status !== 0) {
          this.$message.error('添加管理员失败！')
        }
        this.$message.success('添加管理员成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑管理员对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http({
        method: 'get',
        url: 'my/article/getuserinfo/' + id
      })
      if (res.status !== 0) return this.$message.error('获取管理员信息失败')
      this.editForm = res.data
    },
    // 监听修改管理员对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改管理员信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改管理员信息的请求
        const { data: res } = await this.$http({
          method: 'post',
          url: 'my/article/updateuser',
          data:
            this.Qs.stringify({
              email: this.editForm.email,
              phone: this.editForm.phone,
              id: this.editForm.id
            })
        })
        console.log(res)
        if (res.status !== 0) return this.$message.error('更新管理员数据失败！')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新管理员数据成功')
      })
    },
    // 删除管理员信息
    async removeUserById (id) {
      // 弹框询问
      const confirmRessult = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回一个字符串confirm
      // 如果管理员取消删除，则返回的是一个字符串cancel
      if (confirmRessult !== 'confirm') return
      const { data: res } = await this.$http({
        method: 'get',
        url: 'my/article/deletecate/' + id
      })

      if (res.status !== 0) return this.$message.error('删除管理员失败！')
      this.$message.success('删除管理员成功！')
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
