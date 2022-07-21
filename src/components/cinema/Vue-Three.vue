<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>影厅管理</el-breadcrumb-item>
      <el-breadcrumb-item>三号厅</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 影厅信息区域 -->
    <div class="cinemaContent">
      <div class="movieBox">
        <div class="movieinfo m1">
          <div class="cinemaPic">
            <img src="../../../public/img/cinma.jpg" alt="">
          </div>
          <div class="cinemaInfo ">
            <h1>三号厅</h1>
            <ul>
              <li>类型：杜比</li>
              <li>座椅：按摩</li>
              <li>座位：99</li>
              <li>规格：5D</li>
              <el-button type="primary" style="margin-top:20px" @click="addDialogVisible=true">添加影片</el-button>
            </ul>
          </div>
        </div>
        <div class="movieinfo m2">
          <h1>正在放映</h1>
          <div class="playerMovie">
            <img :src="cinemalist1.movie_pic" alt="">
            <ul>
              <li>{{cinemalist1.movie_name}}</li>
              <li>{{cinemalist1.lan_ver}}</li>
              <li>距结束还有：</li>
              <div class="time">{{nowShowTime}}</div>
              <div class="time" v-if="showTips">当前时间暂无放映场次</div>
            </ul>
          </div>
        </div>
        <div class="movieinfo m3">
          <h1>下一场次</h1>
          <div class="playerMovie">
            <img :src="cinemalist2.movie_pic" alt="">
            <ul>
              <li>{{cinemalist2.movie_name}}</li>
              <li>{{cinemalist2.lan_ver}}</li>
              <li>距开始还有：</li>
              <div class="time">{{nowShowTimeNext}}</div>
              <div class="time" v-if="showTipsNext">当前时间暂无下一场次</div>
            </ul>
          </div>
        </div>
      </div>
      <div class="cinemaBox">
        <span>全部在排影片</span>
        <h1></h1>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item :title="items.movie_name" :name="items.id" v-for="items in cinemalist" :key="items.id">
            <div class="moviePic">
              <img :src="items.movie_pic" alt="">
            </div>
            <div class="movieInfo">
              <ul>
                <li>电影名：{{items.movie_name}}</li>
                <li>类型：{{items.movie_type}}</li>
                <li>地区：{{items.area}}</li>
                <li>语言类型：{{items.lan_ver}}</li>
                <li>开始时间： {{dayjs(items.star_time).format("YYYY-MM-DD HH:mm:ss")}}</li>
                <li>结束时间：{{dayjs(items.end_time).format("YYYY-MM-DD HH:mm:ss")}}</li>
                <el-button type="primary" @click="showCinemaMovie(items.id)">编 辑</el-button>
                <el-button type="danger" @click="deleteCinemaMovie(items.id)">删 除</el-button>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- 添加排片对话框 -->
    <el-dialog title="添加影片排片信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="电影名" prop="movie_name">
          <el-input v-model="addForm.movie_name"></el-input>
        </el-form-item>
        <el-form-item label="影厅名" prop="cinema_name">
          <el-input v-model="addForm.cinema_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="语言版本" prop="lan_ver">
          <el-input v-model="addForm.lan_ver"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="star_time">
          <el-input v-model="addForm.star_time" type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-input v-model="addForm.end_time" type="datetime-local"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCinemaMovie">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改排片的对话框 -->
    <el-dialog title="修改影片排片信息" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="电影名" prop="movie_name">
          <el-input v-model="editForm.movie_name"></el-input>
        </el-form-item>
        <el-form-item label="影厅名" prop="cinema_name">
          <el-input v-model="editForm.cinema_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="语言版本" prop="lan_ver">
          <el-input v-model="editForm.lan_ver"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="star_time">
          <el-input v-model="editForm.star_time" type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-input v-model="editForm.end_time" type="datetime-local"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editCinemaMovie">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      activeName: '0',
      cinemalist1: [],
      cinemalist2: [],
      cinemalist: [],
      addDialogVisible: false,
      editDialogVisible: false,
      showTipsNext: false,
      showTips: false,
      timer: '',
      timer1: '',
      nowTime: +new Date(),
      nowShowTime: '',
      nowShowTimeNext: '',
      addForm: {
        movie_name: '',
        cinema_name: '3号厅',
        lan_ver: '',
        star_time: '',
        end_time: ''

      },
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        movie_name: [
          { required: true, message: '请输入电影名', trigger: 'blur' }
        ],
        lan_ver: [
          { required: true, message: '请输入语言版本', trigger: 'blur' }
        ],
        star_time: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getcinemalist()
  },
  methods: {
    // 正在放映倒计时
    getTime () {
      const thisTime = this.cinemalist1.end_time
      this.countDown(thisTime)
      this.timer1 = setInterval(() => {
        this.nowShowTime = this.countDown(thisTime)
        if (this.nowShowTime === '00:00:00') {
          clearInterval(this.timer1)
          this.cinemalist1 = ''
          this.nowShowTime = ''
          this.showTips = true
          this.cinemalist.shift()
        }
      }, 1000)
    },
    // 下一场次倒计时
    getTimeNext () {
      const thisTime = this.cinemalist2.star_time
      this.countDown(thisTime)
      this.timer = setInterval(() => {
        this.nowShowTimeNext = this.countDown(thisTime)
        if (this.nowShowTimeNext === '00:00:00') {
          clearInterval(this.timer)
          this.cinemalist1 = this.cinemalist2
          this.showTips = false
          this.getTime()
          let i
          this.cinemalist.length > 1 ? i = 1 : i = 0
          switch (i) {
            case 1:
              this.cinemalist2 = this.cinemalist[i]
              this.getTimeNext()
              break
            case 0:
              this.cinemalist2 = ''
              this.nowShowTimeNext = ''
              this.showTipsNext = true
              break
          }
          i++
        }
      }, 1000)
    },
    // 倒计时
    countDown (time) {
      const nowTime = +new Date()
      const endTime = +new Date(time)
      const times = (endTime - nowTime) / 1000
      let h = parseInt(times / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(times / 60 % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(times % 60)
      s = s < 10 ? '0' + s : s
      const remaTime = h + ':' + m + ':' + s
      return remaTime
    },
    // 获取排片信息
    async getcinemalist () {
      const id = 3
      const { data: res } = await this.$http.get('getcinemalist/' + id)
      if (res.status !== 0) return this.$message.error('获取排片列表失败')
      else {
        switch (res.data.length) {
          case 0: {
            this.showTips = true
            this.showTipsNext = true
            this.$message.success('查询成功,该时间段暂无场次')
            break
          }
          case 1:
            if (+new Date(res.data[0].star_time) > +new Date()) {
              this.cinemalist2 = res.data[0]
              this.cinemalist = res.data
              this.showTips = true
              this.getTimeNext()
            } else {
              this.cinemalist1 = res.data[0]
              this.cinemalist = res.data
              this.showTipsNext = true
              this.getTime()
            } break

          default: {
            if (+new Date(res.data[0].star_time) > +new Date()) {
              this.cinemalist2 = res.data[0]
              this.cinemalist = res.data
              this.showTips = true
              this.getTimeNext()
            } else {
              this.cinemalist1 = res.data[0]
              this.cinemalist2 = res.data[1]
              this.cinemalist = res.data
              this.showTips = false
              this.showTipsNext = false
              this.getTime()
              this.getTimeNext()
            } break
          }
        }
      }
    },
    // 添加排片信息
    addCinemaMovie () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addcinemamovie',
          data: this.Qs.stringify(this.addForm)
        })
        if (res.status !== 0) {
          this.$message.error('添加排片信息失败！')
        }
        this.$message.success('添加排片信息成功！')
        this.addDialogVisible = false
        this.getcinemalist()
      })
    },
    // 监听增加排片信息对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改排片信息对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 根据ID展示对应的影片信息
    async showCinemaMovie (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('getcinemamovie/' + id)
      if (res.status !== 0) return this.$message.error('获取排片信息失败')
      this.editForm = res.data
      this.editForm.star_time = this.dayjs(this.editForm.star_time).format('YYYY-MM-DD HH:mm:ss')
      this.editForm.end_time = this.dayjs(this.editForm.end_time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 根据ID编辑对应信息
    editCinemaMovie () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的请求
        const { data: res } = await this.$http({
          method: 'post',
          url: 'updatecinemamovie',
          data:
            this.Qs.stringify({
              movie_name: this.editForm.movie_name,
              lan_ver: this.editForm.lan_ver,
              star_time: this.editForm.star_time,
              end_time: this.editForm.end_time,
              id: this.editForm.id
            })
        })
        if (res.status !== 0) return this.$message.error('更新排片信息数据失败！')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getcinemalist()
        // 提示修改成功
        this.$message.success('更新排片信息数据成功')
      })
    },
    // 删除放映信息
    async deleteCinemaMovie (id) {
      const confirmRessult = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回一个字符串confirm
      // 如果用户取消删除，则返回的是一个字符串cancel
      if (confirmRessult !== 'confirm') return
      const { data: res } = await this.$http({
        method: 'get',
        url: 'deletecinemamovie/' + id
      })

      if (res.status !== 0) return this.$message.error('删除排片信息失败！')
      this.$message.success('删除排片信息成功！')
      this.getcinemalist()
    }
  }
}
</script>

<style lang="less" scoped>
.cinemaContent {
  div {
    border-radius: 3px;
  }
  .movieinfo,
  .cinemaBox {
    box-shadow: 0 5px 10px #ddd;
    background-color: #fff;
  }
  .movieBox {
    display: flex;
    height: 300px;
    .movieinfo {
      flex: 1;
      margin-right: 25px;
      .cinemaPic {
        width: 50%;
        height: 300px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .cinemaInfo {
        flex: 1;
        margin-left: 25px;
        h1 {
          font-size: 30px;
          margin: 20px 0;
          font-weight: 400;
        }
        ul {
          li {
            color: rgb(143, 141, 141);
            margin: 10px 0;
          }
        }
      }
    }
    .movieinfo:last-child {
      margin-right: 0;
    }
    .m1 {
      display: flex;
    }
    .m2,
    .m3 {
      h1 {
        height: 48px;
        font-size: 28px;
        font-weight: 400;
        line-height: 40px;
        margin: 10px;
        border-bottom: 1px solid #ddd;
      }
      h1::before {
        content: '';
        float: left;
        display: block;
        width: 5px;
        height: 27px;
        margin: 8px 9px 0 0;
        background-color: crimson;
      }
      .playerMovie {
        display: flex;
        margin: 20px 0 0 20px;
        img {
          width: 150px;
          height: 200px;
          border-radius: 10px;
        }
        ul {
          flex: 1;
          margin-left: 20px;
        }
        li:nth-child(1) {
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 10px;
        }
        li {
          margin: 10px 0 0 10px;
        }
        .time {
          margin-top: 10px;
          height: 20px;
          font-size: 50px;
          text-align: center;
        }
      }
    }
  }
  .cinemaBox {
    margin-top: 25px;
    padding: 20px;
  }
  /deep/ .el-collapse-item__content {
    display: flex;
    .moviePic {
      width: 160px;
      height: 220px;
      img {
        width: 100%;
      }
    }
    .movieInfo {
      font-size: 20px;
      margin-left: 25px;
    }
  }
}
</style>
