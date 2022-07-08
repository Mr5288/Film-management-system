<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表区 -->
    <el-card style="margin-top:25px">
      <el-button type="primary" @click="addDialogVisible=true" style="margin-bottom:25px">添加角色</el-button>
      <el-table :data="Roleslist" border stripe :header-cell-style="{'text-align':'center'} " :cell-style="{'text-align':'center'} ">
        <el-table-column label="ID" prop="id" min-width=40px></el-table-column>
        <el-table-column label="角色名称" prop="rolesname"></el-table-column>
        <el-table-column label="角色描述" prop="role_description"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{dayjs(scope.row.creat_time).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200">
          <template slot-scope="scope">
            {{dayjs(scope.row.now_time).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="276">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="showSetRightDialog(scope.row.rolesname),getPowerList(),getPitchPowerList()">管理</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeRolesById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="角色名" prop="Rolesname">
          <el-input v-model="addForm.Rolesname"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_description">
          <el-input v-model="addForm.role_description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%" :close-on-click-modal="false" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="rolesname">
          <el-input v-model="editForm.rolesname"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_description">
          <el-input v-model="editForm.role_description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" :close-on-click-modal="false" width="30%" @close="closeDefkeys">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="defkeys" default-expand-all ref="treeRef"></el-tree>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 10 // 每页显示几条数据，默认每页显示10条
      },
      Roleslist: [], // 角色列表
      rightslist: [], // 所有权限列表
      treeProps: {
        label: 'powername',
        children: 'children'
      }, // 树形控件属性绑定对象
      defkeys: [], // 默认选中的节点Id值数组
      total: 0, // 总条数
      addDialogVisible: false, // 控制添加角色对话框的显示与隐藏
      editDialogVisible: false, // 控制修改角色对话框的显示与隐藏
      setRightDialogVisible: false, // 控制分配权限对话框的显示与隐藏
      adminname: '', // 角色名称
      // 添加角色的表单数据
      addForm: {
        Rolesname: '',
        role_description: ''
      },
      // 查询到的角色信息
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        Rolesname: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称在2到10个字符之间', trigger: 'blur' }
        ],
        role_description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editFormRules: {
        rolesname: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        role_description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表事件
    async getRolesList () {
      const { data: res } = await this.$http(
        {
          method: 'get',
          url: 'allpowers',
          params: this.queryInfo
        })
      if (res.status !== 0) return this.$message.error('获取角色数据失败!')
      this.Roleslist = res.data
      this.total = res.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getRolesList()
    },
    // 监听页码值改变事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getRolesList()
    },
    // 监听添加角色对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色事件
    addRoles () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addrole',
          data: this.Qs.stringify(this.addForm)
        })
        if (res.status !== 0) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 展示编辑角色对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http({
        method: 'get',
        url: 'getroleInfo/' + id
      })
      if (res.status !== 0) return this.$message.error('获取角色信息失败')
      this.editForm = res.data
    },
    // 监听修改角色对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRolesInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改角色信息的请求
        const { data: res } = await this.$http({
          method: 'post',
          url: 'updaterole',
          data:
            this.Qs.stringify({
              rolesname: this.editForm.rolesname,
              role_description: this.editForm.role_description,
              id: this.editForm.id
            })
        })
        if (res.status !== 0) return this.$message.error('更新角色数据失败！')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色数据成功')
      })
    },
    // 删除角色信息
    async removeRolesById (id) {
      // 弹框询问
      const confirmRessult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回一个字符串confirm
      // 如果角色取消删除，则返回的是一个字符串cancel
      if (confirmRessult !== 'confirm') return
      const { data: res } = await this.$http({
        method: 'get',
        url: 'deleterole/' + id
      })

      if (res.status !== 0) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 展示分配权限的对话框
    showSetRightDialog (name) {
      // 获取所有权限列表的数据
      this.setRightDialogVisible = true
      this.adminname = name
    },
    // 获取所有权限
    async getPowerList () {
      const { data: res } = await this.$http.get('powerlist')
      this.rightslist = this.arrayToTree(res.data, {
        parentProperty: 'pid',
        customID: 'id',
        childrenProperty: 'children'
      })
    },
    // 获取已有权限
    async getPitchPowerList () {
      const { data: res } = await this.$http({
        method: 'get',
        url: 'pitchpowerlist',
        params: { rolesname: this.adminname }
      }
      )
      this.defkeys = []
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].pid !== null) { this.defkeys[this.defkeys.length] = res.data[i].pid }
      }
    },
    // 关闭弹窗，清空数组已有权限
    closeDefkeys () {
      this.defkeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [999,
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http({
        method: 'post',
        url: 'updatepower',
        data: this.Qs.stringify({ adminname: this.adminname, rids: idStr })
      })
      if (res.status !== 0) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
