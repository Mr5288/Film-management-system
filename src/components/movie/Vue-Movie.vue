<template>
  <div class="movieContainer">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 电影示例区域 -->
    <div class="showMovie">
      <div class="showMovieLeft">
        <div class="picBox">
          <img src="/img/example.jpg" alt="">
        </div>
      </div>
      <div class="showMovieRight">
        <div class="movietitle">
          <h1>电影中文名</h1>
          <p>English name of movie</p>
          <ul>
            <li>类型</li>
            <li>地区/时长</li>
            <li>上映时间
              <el-button type="primary" style="margin-left:100px" @click="upMovie">上传电影</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 导航栏区域 -->
    <div class="navBox" style="margin-bottom:30px">
      <span class="movieTitle">电影列表 ></span>
      <div class="searchBox">
        <div class="search">
          <input type="text" v-model="search" placeholder="输入要查找的电影" @blur="blur" @click="getsearch">
        </div>
        <div class="searchBtn">
          <button class="el-icon-search" @click="searchMovie">
          </button>
        </div>
        <div class="searchContent" v-if="showSearchBox">
          <div class="movieInfoBox" v-for="items in movieInfo" :key="items.id" @click="serachMovieInfo(items.id)">
            <div class="imgBox">
              <img :src="items.movie_pic" alt="">
            </div>
            <div class="textContent">{{items.movie_name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 电影列表区域 -->
    <div class="movieList">
      <!-- 电影列表区域 -->
      <div class="showingMovieList">
        <div class="movieBox" v-for="items in movielist" :key="items.id">
          <div class="imgBox">
            <img :src="items.movie_pic" alt="">
          </div>
          <div class="textContent">
            <ul>
              <li class="title">{{items.movie_name}}</li>
              <li class="time">{{items.movie_type}}</li>
              <li class="time">{{items.movie_time}}</li>
              <li class="time">{{items.release_time}}</li>
              <li class="btn" style="color: #eb002a;" @click="removeMovieById(items.id)">删除</li>
              <li class="btn" style="color: #409eff;" @click="showEditDialog(items.id)">编辑</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 15, 20, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 上传电影对话框 -->
    <el-dialog title="添加电影" :visible.sync="upMovieDialogVisible" width="40%" :close-on-click-modal="false" @close="upDialogClosed">
      <el-form ref="upFormRef" :model="upForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="中文名" prop="movie_name">
          <el-input v-model="upForm.movie_name"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="movie_enname">
          <el-input v-model="upForm.movie_enname"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="movie_type">
          <el-input v-model="upForm.movie_type"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="upForm.area"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="movie_time">
          <el-input v-model="upForm.movie_time"></el-input>
        </el-form-item>
        <el-form-item label="上映时间及地点" prop="release_time">
          <el-input v-model="upForm.release_time"></el-input>
          <span>例：2021-09-30 09:30中国大陆上映</span>
        </el-form-item>
        <el-form-item label="票价" prop="price">
          <el-input v-model="upForm.price"></el-input>
        </el-form-item>
        <el-form-item label="影片简介" prop="brief_introduction">
          <el-input type="textarea" v-model="upForm.brief_introduction"></el-input>
        </el-form-item>
        <el-form-item label="预览图" prop="movie_pic">
          <el-input v-model="upForm.movie_pic" @click.native="getMoviePic"></el-input>
          <input type="file" id="file" accept="image/png,image/jpeg" ref="file" @change="onInputChange($event)" hidden>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upMovieDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMovie">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑电影对话框 -->
    <el-dialog title="编辑电影" :visible.sync="editMovieDialogVisible" width="40%" :close-on-click-modal="false" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="中文名" prop="movie_name">
          <el-input v-model="editForm.movie_name"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="movie_enname">
          <el-input v-model="editForm.movie_enname"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="movie_type">
          <el-input v-model="editForm.movie_type"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="editForm.area"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="movie_time">
          <el-input v-model="editForm.movie_time"></el-input>
        </el-form-item>
        <el-form-item label="时间地点" prop="release_time">
          <el-input v-model="editForm.release_time"></el-input>
        </el-form-item>
        <el-form-item label="票价" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMovieDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMovieInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 返回顶部区域 -->
    <!-- <el-backtop target=".el-main" :bottom="100" class="el-icon-caret-top"></el-backtop> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      movielist: [], // 电影列表
      total: 0, // 总条数
      upMovieDialogVisible: false, // 添加电影对话框
      editMovieDialogVisible: false, // 编辑电影对话框
      upForm: {
        movie_name: '',
        movie_enname: '',
        movie_type: '',
        movie_time: '',
        area: '',
        release_time: '',
        price: '',
        brief_introduction: '',
        movie_pic: ''
      },
      editForm: {},
      queryInfo: {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 15, // 每页显示几条数据，默认每页显示10条
        movie_name: '', // 电影名
        id: '' // ID
      },
      // 添加表单的验证规则对象
      addFormRules: {
        movie_name: [
          { required: true, message: '请输入电影名', trigger: 'blur' }
        ],
        movie_enname: [
          { required: true, message: '请输入电影英文名', trigger: 'blur' }
        ],
        movie_type: [
          { required: true, message: '请输入电影类型', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地区', trigger: 'blur' }
        ],
        movie_time: [
          { required: true, message: '请输入时长', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入票价', trigger: 'blur' }
        ],
        release_time: [
          { required: true, message: '请输入上映时间及地点', trigger: 'blur' }
        ],
        brief_introduction: [
          { required: true, message: '请输入影片简介', trigger: 'blur' }
        ],
        movie_pic: [
          { required: true, message: '请上传预览图', trigger: 'blur' }
        ]
      },
      search: '',
      movieInfo: [], // 查询电影列表
      showSearchBox: false
    }
  },
  created () {
    this.getMovieList()
  },
  watch: {
    search (newVal) {
      if (newVal === '') {
        this.movieInfo = []
        this.showSearchBox = false
      } else {
        this.showSearchBox = true
        this.search = newVal
        this.getMovieInfo()
      }
    }
  },
  methods: {
    // 获取电影列表
    async getMovieList () {
      this.queryInfo.movie_name = this.search
      const { data: res } = await this.$http(
        {
          method: 'get',
          url: 'getmovielist',
          params: this.queryInfo
        })
      if (res.status !== 0) return
      this.movielist = res.data
      this.total = res.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getMovieList()
    },
    // 监听页码值改变事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getMovieList()
    },
    // 获取搜索电影列表
    async getMovieInfo () {
      const { data: res } = await this.$http(
        {
          method: 'get',
          url: 'getmovieInfo',
          params: {
            movie_name: this.search,
            pagenum: this.queryInfo.pagenum,
            pagesize: this.queryInfo.pagesize
          }
        })
      if (res.status !== 0) return
      this.movieInfo = res.data
    },
    // 搜索框失去焦点事件
    blur () {
      setTimeout(() => { this.showSearchBox = false }, 100)
    },
    // 搜索框获得焦点事件
    getsearch () {
      if (this.search === '') return
      this.showSearchBox = true
    },
    // 点击按钮搜索电影事件
    searchMovie () {
      if (this.search === '') return
      this.queryInfo.id = '' // 将请求信息中的id清空
      this.getMovieList() // 发起请求
      this.search = '' // 将搜索框的值清空
    },
    // 点击搜索弹出框事件
    serachMovieInfo (id) {
      this.queryInfo.movie_name = ''
      this.queryInfo.id = id
      this.getMovieList()
      this.movielist = []
      this.search = ''
      this.showSearchBox = false
    },
    // 上传电影弹窗
    upMovie () {
      this.upMovieDialogVisible = true
    },
    // 关闭上传电影弹窗
    upDialogClosed () {
      this.$refs.upFormRef.resetFields()
    },
    // 添加电影并提交
    addMovie () {
      // 添加电影事件
      this.$refs.upFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({
          method: 'post',
          url: 'addmovie',
          data: this.Qs.stringify(this.upForm)
        })
        if (res.status !== 0) {
          this.$message.error('添加电影失败！')
        }
        this.$message.success('添加电影成功！')
        this.upMovieDialogVisible = false
        this.getMovieList()
      })
    },
    // 编辑电影弹窗
    async showEditDialog (id) {
      this.editMovieDialogVisible = true
      const { data: res } = await this.$http({
        method: 'get',
        url: 'getmovieInfo/' + id
      })
      if (res.status !== 0) return this.$message.error('获取电影信息失败')
      this.editForm = res.data
    },
    // 关闭编辑电影弹窗
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改电影信息并提交
    updateMovieInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的请求
        const { data: res } = await this.$http({
          method: 'post',
          url: 'updatemovie',
          data:
            this.Qs.stringify({
              movie_name: this.editForm.movie_name,
              movie_enname: this.editForm.movie_enname,
              movie_type: this.editForm.movie_type,
              area: this.editForm.area,
              movie_time: this.editForm.time,
              release_time: this.release_time,
              price: this.editForm.price,
              id: this.editForm.id
            })
        })
        if (res.status !== 0) return this.$message.error('更新电影信息失败！')
        // 关闭对话框
        this.editMovieDialogVisible = false
        // 刷新数据列表
        this.getMovieList()
        // 提示修改成功
        this.$message.success('更新电影信息成功')
      })
    },
    // 删除电影
    async removeMovieById (id) {
      // 弹框询问
      const confirmRessult = await this.$confirm('此操作将删除该电影, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回一个字符串confirm
      // 如果用户取消删除，则返回的是一个字符串cancel
      if (confirmRessult !== 'confirm') return
      const { data: res } = await this.$http({
        method: 'get',
        url: 'deletemovie/' + id
      })
      if (res.status !== 0) return this.$message.error('删除电影失败！')
      this.$message.success('删除电影成功！')
      this.getMovieList()
    },
    // 点击上传图片输入框弹出文件
    getMoviePic () {
      this.$refs.file.click()
    },
    // 将图片转为base64 格式
    onInputChange (el) {
      const file = el.target.files[0]
      const type = file.type.split('/')[0]
      if (type === 'image') {
        // 将图片转化为base64
        const reader = new FileReader()
        reader.readAsDataURL(file) // readAsDataURL方法可以将上传的图片格式转为base64,然后在存入到图片路径,
        reader.onload = () => {
          const image = reader.result // image即base64格式，后面调用后端请求传入image
          this.upForm.movie_pic = image
        }
      }
    }

  }
}
</script>

<style lang="less" scoped>
.navBox {
  width: 100%;
  position: relative;
  border-radius: 10px;
  padding-left: 5px;
  background-image: linear-gradient(to right, #9fc0fc, #f3f2ee);
  .movieTitle {
    font-size: 18px;
    line-height: 40px;
  }
  .searchBox {
    float: right;
    overflow: hidden;
    .search {
      float: left;
      input {
        width: 300px;
        height: 40px;
        padding-left: 10px;
        border: 1px solid #000;
        border-radius: 20px 0 0 20px;
      }
    }
    .searchBtn {
      float: right;
      button {
        width: 50px;
        height: 40px;
        font-size: 15px;
        font-weight: 700;
        border: 1px solid #000;
        border-left: 0;
        border-radius: 0 10px 10px 0;
        cursor: pointer;
        background-color: #6495ed;
        vertical-align: middle;
      }
    }
    .searchContent {
      position: absolute;
      top: 40px;
      z-index: 99;
      width: 350px;
      border-radius: 10px;
      background-color: #fff;
      cursor: pointer;
      .movieInfoBox {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border-bottom: 1px solid #999;
        overflow: hidden;
        .imgBox {
          float: left;
          height: 50px;
          img {
            height: 100%;
            border-radius: 10px;
          }
        }
        .textContent {
          margin-left: 65px;
          font-size: 18px;
          line-height: 50px;
          font-weight: 400;
        }
      }
      .movieInfoBox:hover {
        color: #6495ed;
        background-color: #faf8fa;
      }
    }
  }
}
.showMovie {
  display: flex;
  align-items: center;
  width: 100%;
  height: 300px;
  margin-bottom: 25px;
  background-color: #392f59;
  .showMovieLeft {
    width: 200px;
    margin-left: 200px;
    .picBox {
      width: 160px;
      height: 220px;
      border: 3px solid #fff;
      img {
        width: 100%;
      }
    }
  }
  .showMovieRight {
    flex: 1;
    line-height: 35px;
    color: #fff;
    h1 {
      margin: 5px 0;
      font-size: 32px;
      font-weight: 400;
    }
    p {
      margin: 5px 0;
    }
    ul {
      margin: 5px 0;
      padding: 0;
    }
    li {
      margin: 5px;
    }
  }
}
.showingMovieList {
  overflow: hidden;
  padding: 20px;
  .movieBox {
    float: left;
    width: 350px;
    margin: 0 25px 35px 15px;
    user-select: none;
    border-radius: 10px;
    background-color: #fff;
    transition: all 0.4s ease-in-out;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.25);
    .imgBox {
      float: left;
      height: 150px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px 0 0 10px;
      }
    }
    .textContent {
      margin-left: 120px;
      padding: 15px 10px;

      li {
        line-height: 25px !important;
      }
      .title {
        font-size: 20px;
        font-weight: 200;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        font-size: 13px;
        line-height: 30px;
        color: #999;
      }
      .btn {
        float: right;
        font-size: 15px;
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
}
.movieBox:hover {
  transform: scale(1.1);
  transition: all 0.4s ease-in-out;
}
</style>
