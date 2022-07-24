<template>

  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="title">有个影院后台管理系统</div>
      <div class="info">
        <div class="avatar">
          <img :src="$store.state.userInfo.user_pic" alt="">
        </div>
        <div class="self">
          <!-- 导航栏头像区 -->
          <el-menu mode="horizontal" background-color="#001529" text-color="#fff" active-text-color="null">
            <el-submenu index="2">
              <template slot="title">我</template>
              <el-menu-item index="/userinfo" @click="userInfo">个人中心</el-menu-item>
              <el-menu-item index="2-2" @click="dialogVisible = true">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
          <!-- 退出系统弹窗 -->
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
    <el-container style="height: 500px;">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleColapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#23262e" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path">
          <!-- 系统首页一级菜单 -->
          <el-submenu index="index">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-s-home"></i>
              <!-- 文本 -->
              <span style="font-size:20px">系统首页</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/index')" index="/index">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-home"></i>
                <!-- 文本 -->
                <span>系统首页</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <!-- 循环首页一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in roles" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span style="font-size:20px">{{item.powername}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" @click="saveNavState('/'+subItem.path)" v-for="subItem in item.children" :key="subItem.id">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[subItem.id]"></i>
                <!-- 文本 -->
                <span>{{subItem.powername}}</span>
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
      dialogVisible: false,
      roles: [], // 角色信息
      iconsObj: {
        1: 'el-icon-user',
        2: 'el-icon-setting',
        3: 'el-icon-video-play',
        4: 'el-icon-video-camera',
        5: 'el-icon-document-copy',
        6: 'el-icon-fork-spoon',
        7: 'el-icon-user-solid',
        8: 'el-icon-user-solid',
        9: 'el-icon-menu',
        10: 'el-icon-video-pause',
        11: 'el-icon-data-analysis',
        12: 'el-icon-data-analysis',
        13: 'el-icon-data-analysis',
        14: 'el-icon-document',
        15: 'el-icon-document',
        16: 'el-icon-potato-strips'

      }
    }
  },
  created () {
    // 获取角色权限
    this.getRolePower()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.$store.dispatch('getUserInfo')
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
    },
    // 获取角色权限
    async getRolePower () {
      const { data: res } = await this.$http.get('rolepower')
      this.roles = this.arrayToTree(res.data, {
        parentProperty: 'pid',
        customID: 'id',
        childrenProperty: 'children'
      })
    },
    userInfo () {
      this.$router.push('/userinfo')
    }

  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  overflow-y: hidden;
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
  border-top: 1px solid #ddd;
  background-color: #fafafa;
}
</style>
