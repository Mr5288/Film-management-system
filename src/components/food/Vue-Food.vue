<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>小食管理</el-breadcrumb-item>
      <el-breadcrumb-item>小食列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 小食列表 -->
    <div class="foodBox">
      <!-- 添加小食 -->
      <div class="addFood" style="border: 2px dashed #d9d9d9;">
        <button type="button" class="btn" id="addfood" @click="drawer = true">+ 新增产品</button>
      </div>
      <!-- 新增产品弹出框 -->
      <el-drawer title="新增产品" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <el-form ref="upFormRef" :model="upForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="小食名" prop="food_name">
            <el-input v-model="upForm.food_name"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="food_stock">
            <el-input v-model="upForm.food_stock"></el-input>
          </el-form-item>
          <el-form-item label="日期" prop="food_date">
            <el-input v-model="upForm.food_date"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="food_price">
            <el-input v-model="upForm.food_price"></el-input>
          </el-form-item>
          <el-form-item label="预览图" prop="food_pic">
            <el-input v-model="upForm.food_pic" @click.native="getFoodPic"></el-input>
            <input type="file" id="file" accept="image/png,image/jpeg" ref="file" @change="onInputChange($event)" hidden>
          </el-form-item>
        </el-form>
        <p>
          <el-button @click="drawer = false">取 消</el-button>
          <el-button type="primary" @click="addFood">确 定</el-button>
        </p>
      </el-drawer>
      <!-- 编辑产品弹出框 -->
      <el-drawer title="编辑产品" :visible.sync="drawers" :direction="direction" :before-close="handleClose">
        <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="小食名" prop="food_name">
            <el-input v-model="editForm.food_name"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="food_stock">
            <el-input v-model="editForm.food_stock"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="food_price">
            <el-input v-model="editForm.food_price"></el-input>
          </el-form-item>
          <el-form-item label="预览图" prop="food_pic">
            <el-input v-model="editForm.food_pic" @click.native="getFoodPic"></el-input>
            <input type="file" id="file" accept="image/png,image/jpeg" ref="file" @change="onInputChange($event)" hidden>
          </el-form-item>
        </el-form>
        <p>
          <el-button @click="drawer = false">取 消</el-button>
          <el-button type="primary" @click="editFoods">确 定</el-button>
        </p>
      </el-drawer>
      <!-- 小食列表 -->
      <div class="foodlist" v-for="items in foodlist" :key="items.id">
        <div class="food_picbox">
          <div class="food_pic">
            <img :src="items.food_pic" alt="">
          </div>
          <div class="foodinfo">
            <ul>
              <li>名称：<strong style="font-size: 16px;">{{items.food_name}}</strong></li>
              <li>库存：{{items.food_stock}} 件</li>
              <li>日期：{{dayjs(items.food_date).format("YYYY-MM-DD HH:mm:ss")}}</li>
              <li>售价：￥{{items.food_price}}</li>
            </ul>
          </div>
        </div>
        <div class="btn_box">
          <div class="btn_left"><button type="button" class="layui-btn btn-edit" @click="drawers = true ,editFood(items.id)">编辑</button></div>
          <div class="btn_right"> <button type="button" class="layui-btn btn-delete" @click="deleteFood(items.id)">下架</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      foodlist: [],
      drawer: false,
      drawers: false,
      direction: 'btt',
      upForm: {
        food_name: '',
        food_stock: '',
        food_date: '',
        food_price: '',
        food_pic: ''
      },
      addFormRules: {
        food_name: [
          { required: true, message: '请输入小食名', trigger: 'blur' }
        ],
        food_stock: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        food_date: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ],
        food_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        food_pic: [
          { required: true, message: '请上传预览图', trigger: 'blur' }
        ]
      },
      editForm: {}
    }
  },
  created () {
    this.getFoodlist()
  },
  methods: {
    async getFoodlist () {
      const { data: res } = await this.$http('getfoodlist')
      this.foodlist = res.data
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 点击上传图片输入框弹出文件
    getFoodPic () {
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
          this.upForm.food_pic = image
        }
      }
    },
    // 添加小食
    async addFood () {
      const { data: res } = await this.$http({
        method: 'post',
        url: 'addfood',
        data: this.Qs.stringify(this.upForm)
      })
      if (res.status !== 0) {
        this.$message.error('添加小食失败！')
      }
      this.$message.success('添加小食成功！')
      this.drawer = false
      this.getFoodlist()
    },
    // 查新指定小食
    async editFood (id) {
      const { data: res } = await this.$http.get('getfoodinfo/' + id)
      this.editForm = res.data
    },
    // 编辑小食
    async editFoods () {
      const { data: res } = await this.$http({
        method: 'post',
        url: 'updatefood',
        data: this.Qs.stringify({
          food_name: this.editForm.food_name,
          food_pic: this.editForm.food_pic,
          food_price: this.editForm.food_price,
          food_stock: this.editForm.food_stock,
          id: this.editForm.id

        })
      })
      if (res.status !== 0) {
        return this.$message.error('更新小食失败！')
      }
      this.$message.success('更新小食成功！')
      this.drawers = false
      this.getFoodlist()
    },
    // 删除小食事件
    async deleteFood (id) {
      // 弹框询问
      const confirmRessult = await this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回一个字符串confirm
      // 如果用户取消删除，则返回的是一个字符串cancel
      if (confirmRessult !== 'confirm') return
      const { data: res } = await this.$http({
        method: 'get',
        url: 'deletefoods/' + id
      })
      if (res.status !== 0) return this.$message.error('删除产品失败！')
      this.$message.success('删除产品成功！')
      this.getFoodList()
    }

  }
}
</script>

<style lang="less" scoped>
.foodBox {
  overflow: hidden;
  .addFood {
    float: left;
    margin: 20px;
    margin-bottom: 0;
    .btn {
      width: 347px;
      height: 200px;
      background-color: #fff;
      font-size: 20px;
      text-align: center;
      line-height: 200px;
      border: 0;
      cursor: pointer;
    }
    .btn:hover {
      color: #1890ff;
    }
  }
  .addFood:hover,
  .foodlist:hover {
    box-shadow: 0 0 15px 2px #918f8f;
    /*盒子阴影*/
    transition: all 0.5s;
    /*持续时间*/
  }
  .foodlist {
    float: left;
    margin: 20px;
    width: 347px;
    height: 200px;
    margin-left: 25px;
    margin-bottom: 15px;

    background-color: #fff;
    .food_picbox {
      overflow: hidden;
      margin: 8px;
      .food_pic img {
        float: left;
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .foodinfo {
        float: right;
        li {
          width: 210px;
          height: 23px;
          margin-top: 10px;
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
    .btn_box {
      width: 347px;
      border-top: 2px solid #f0f0f0;
      .btn_left {
        float: left;
        width: 163px;
        height: 50px;
      }
      .btn_right {
        float: left;
        width: 162px;
        height: 50px;
        border-left: 2px solid #f0f0f0;
      }
      button {
        width: 100%;
        height: 100%;
        border: 0;
        font-size: 15px;
        line-height: 50px;
        cursor: pointer;
        background-color: #fff;
      }
      button:hover {
        color: #1890ff;
      }
    }
  }
}
.el-form {
  overflow: hidden;
}
.el-form-item {
  float: left;
  width: 30%;
}
p {
  float: right;
  margin-right: 50px;
}
</style>
