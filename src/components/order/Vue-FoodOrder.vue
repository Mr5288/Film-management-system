<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>小食订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索与添加区 -->
    <el-card>
      <el-row :gutter="20">
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
        <el-table-column label="订单编号" prop="id"></el-table-column>
        <el-table-column label="会员名" prop="username"></el-table-column>
        <el-table-column label="食品名" prop="food_name"></el-table-column>
        <el-table-column label="数量" prop="food_num"></el-table-column>
        <el-table-column label="状态">{{food_state}}</el-table-column>
        <el-table-column label="订单生成时间" width="200">
          <template slot-scope="scope">
            {{dayjs(scope.row.creat_time).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" disabled>编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      food_state: '已完成',
      queryInfo: {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 10, // 每页显示几条数据，默认每页显示10条
        username: '' // 会员名
      },
      orderlist: [], // 订单列表
      total: 0// 总条数
    }
  },
  created () {
    this.getOrderlist()
  },
  methods: {
    // 获取订单列表事件
    async getOrderlist () {
      const { data: res } = await this.$http(
        {
          method: 'get',
          url: 'getfood',
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
        url: 'deletefood/' + id
      })

      if (res.status !== 0) return this.$message.error('删除订单失败！')
      this.$message.success('删除订单成功！')
      this.getOrderlist()
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
