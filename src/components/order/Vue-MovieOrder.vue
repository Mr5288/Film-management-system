<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="value" placeholder="筛选订单状态" @change="showSelect" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入会员名或订单号查询" clearable v-model="queryInfo.username" @clear="getOrderlist">
            <el-button slot="append" icon="el-icon-search" @click="getOrderlist">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <!-- 订单列表区 -->
    <el-card style="margin-top:25px">
      <el-table :data="orderlist" border stripe :header-cell-style="{'text-align':'center'} " :cell-style="{'text-align':'center'} ">
        <el-table-column label="订单编号" prop="id" width="100"></el-table-column>
        <el-table-column label="会员名" prop="username"></el-table-column>
        <el-table-column label="电影中文名" prop="movie_name"></el-table-column>
        <el-table-column label="电影外文名" prop="movie_enname"></el-table-column>
        <el-table-column label="影厅" prop="cinema"></el-table-column>
        <el-table-column label="座位号" prop="seat"></el-table-column>
        <el-table-column label="开始时间" prop="start_time">
          <template slot-scope="scope">
            {{dayjs(scope.row.start_time).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="订单生成时间" width="200">
          <template slot-scope="scope">
            {{dayjs(scope.row.creat_time).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state">
          <template slot-scope="scope">
            {{scope.row.state | state}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改订单的对话框 -->
    <el-dialog title="订单详情" :visible.sync="editDialogVisible" width="30%" :close-on-click-modal="false" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="会员名:">
          <span>{{editForm.username}}</span>
        </el-form-item>
        <el-form-item label="订单号:" prop="id">
          <span>{{editForm.id}}</span>
        </el-form-item>
        <el-form-item label="电影名:" prop="movie_name">
          <span>{{editForm.movie_name}}</span>
        </el-form-item>
        <el-form-item label="影厅名:" prop="movie_name">
          <span>{{editForm.cinema}}</span>
        </el-form-item>
        <el-form-item label="座位号:" prop="movie_name">
          <span>{{editForm.seat}}</span>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" v-if="disstate" @click="agreeRefund(editForm.id)">同意退款</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      options: [
        {
          value: '1',
          label: '未开始'
        }, {
          value: '0',
          label: '已结束'
        },
        {
          value: '2',
          label: '退款中'
        }, {
          value: '3',
          label: '已退款'
        }],
      value: '',
      queryInfo: {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 10, // 每页显示几条数据，默认每页显示10条
        username: '', // 会员名
        type: '', // 影厅类型
        state: '' // 订单状态
      },
      orderlist: [], // 订单列表
      total: 0, // 总条数
      editDialogVisible: false, // 控制修改订单对话框的显示与隐藏
      // 查询到的订单信息
      editForm: {},
      disstate: true
    }
  },
  created () {
    this.getOrderlist()
  },
  filters: {
    state (val) {
      let state = val
      if (state === 0) {
        state = '已结束'
      } else if (state === 1) { state = '未开始' } else if (state === 2) { state = '退款中' } else if (state === 3) { state = '已退款' }
      return state
    }
  },
  methods: {
    // 获取订单列表事件
    async getOrderlist () {
      const { data: res } = await this.$http(
        {
          method: 'get',
          url: 'getuserorder',
          params: this.queryInfo
        })
      if (res.status !== 0) return this.$message.error('获取订单数据失败!')
      this.orderlist = res.data
      this.total = res.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderlist()
    },
    // 监听页码值改变事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderlist()
    },
    // 展示编辑订单对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http({
        method: 'get',
        url: 'getorder/' + id
      })
      if (res.status !== 0) return this.$message.error('获取订单信息失败')
      this.editForm = res.data
      if (this.editForm.state === 0) (this.disstate = false)
      else if (this.editForm.state === 1) (this.disstate = true)
      else if (this.editForm.state === 2) (this.disstate = true)
      else if (this.editForm.state === 3) (this.disstate = false)
    },
    // 监听修改订单对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改订单信息并提交
    editOrderInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改订单信息的请求
        const { data: res } = await this.$http({
          method: 'post',
          url: 'updateorder',
          data:
            this.Qs.stringify({
              email: this.editForm.email,
              phone: this.editForm.phone,
              id: this.editForm.id
            })
        })
        if (res.status !== 0) return this.$message.error('更新订单数据失败！')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getOrderlist()
        // 提示修改成功
        this.$message.success('更新订单数据成功')
      })
    },
    // 删除订单信息
    async removeUserById (id) {
      // 弹框询问
      const confirmRessult = await this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回一个字符串confirm
      // 如果订单取消删除，则返回的是一个字符串cancel
      if (confirmRessult !== 'confirm') return
      const { data: res } = await this.$http({
        method: 'get',
        url: 'deleteorder/' + id
      })

      if (res.status !== 0) return this.$message.error('删除订单失败！')
      this.$message.success('删除订单成功！')
      this.getOrderlist()
    },
    // 筛选框事件
    showSelect (state) {
      if (state === '已结束') { this.queryInfo.state = 0 } else if (state === '未开始') { this.queryInfo.state = 1 } else if (state === '退款中') { this.queryInfo.state = 2 } else if (state === '已退款') { this.queryInfo.state = 3 }
      this.getOrderlist()
      this.queryInfo.state = ''
    },
    // 同意退款
    async agreeRefund (id) {
      const { data: res } = await this.$http('updateorder/' + id)
      if (res.statu !== 0) this.$message.error('订单退款失败')
      this.$message.success('订单退款成功！')
      this.getOrderlist()
      this.value = ''
      this.editDialogVisible = false
    }
  }

}
</script>
<style lang="less" scoped>
.el-table {
  text-align: center;
}
.el-col {
  .el-button {
    color: #fff;
    border-radius: 0 3px 3px 0;
    background-color: purple;
    border: 1px solid purple;
  }
}
</style>
