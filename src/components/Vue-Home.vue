<template>

  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="title">有个影院后台管理系统</div>
      <div class="info">
        <div class="avatar">
          <img src="../../public/img/pic2.jpg" alt="">
        </div>
        <div class="self">
          <el-menu mode="horizontal" background-color="#001529" text-color="#fff" active-text-color="null">
            <el-submenu index="2">
              <template slot="title">我</template>
              <el-menu-item index="2-1">个人中心</el-menu-item>
              <el-menu-item index="2-2" @click="dialogVisible = true">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
          <el-dialog title="提示" :visible.sync="dialogVisible" top="20vh" width="20%">
            <span>确认退出吗</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="logOut">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleColapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#23262e" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 系统首页一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-s-home"></i>
              <!-- 文本 -->
              <span style="font-size:20px">系统首页</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/index" @click="saveNavState('/index')">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-home"></i>
                <!-- 文本 -->
                <span>系统首页</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 用户管理一级菜单 -->
          <el-submenu index="2">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-user"></i>
              <!-- 文本 -->
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/userList" @click="saveNavState('/userList')">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-user-solid"></i>
                <!-- 文本 -->
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 权限管理一级菜单 -->
          <el-submenu index="3">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-setting"></i>
              <!-- 文本 -->
              <span>权限管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/authorityList" @click="saveNavState('/index')">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>权限列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 电影管理一级菜单 -->
          <el-submenu index="4">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-video-play"></i>
              <!-- 文本 -->
              <span>电影管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/movieList">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-video-pause"></i>
                <!-- 文本 -->
                <span>电影列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 订单管理一级菜单 -->
          <el-submenu index="5">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-document-copy"></i>
              <!-- 文本 -->
              <span>订单管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/movieOrders">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-document"></i>
                <!-- 文本 -->
                <span>电影订单</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/foodOrders">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-document"></i>
                <!-- 文本 -->
                <span>小食订单</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 放映管理一级菜单 -->
          <el-submenu index="6">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-video-camera"></i>
              <!-- 文本 -->
              <span>放映管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/vedioList">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-data-analysis"></i>
                <!-- 文本 -->
                <span>影厅列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 小食管理一级菜单 -->
          <el-submenu index="7">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-fork-spoon"></i>
              <!-- 文本 -->
              <span>小食管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/foodList">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-potato-strips"></i>
                <!-- 文本 -->
                <span>小食列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 菜单区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 尾部区域 -->
        <el-footer>有个影院后台管理系统2.0版本---Vue练习项目</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      dialogVisible: false
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击按钮，折叠与展开菜单
    toggleColapse () {
      this.isCollapse = !this.isCollapse
    },
    // 点击菜单保存激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 点击退出登录,退出系统
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #001529;
  .title {
    font-size: 25px;
    color: #f3f2ee;
    line-height: 60px;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    /deep/ .el-submenu__title {
      font-size: 16px;
    }
  }
}
.el-main {
  background-color: #f3f2ee;
}
.el-aside {
  transition: all 0.4s ease-in-out;
  background-color: #23262e;
  overflow-x: hidden;
  .el-menu {
    border: none;
    user-select: none;
  }
  ul {
    margin-top: 40px;
    /deep/ .el-submenu__title {
      font-size: 20px;
      user-select: none;
    }
  }
}
.toggle-button {
  background-color: #4a5064;
  color: #f3f2ee;
  text-align: center;
  letter-spacing: 0.2em;
  line-height: 24px;
  user-select: none;
  cursor: pointer;
}
.el-menu-item {
  font-size: 17px;
}
.el-footer {
  height: 44px !important;
  box-shadow: -1px 0 4px rgb(0 0 0 / 12%);
  text-align: center;
  line-height: 44px;
  background-color: #fafafa;
}
</style>
