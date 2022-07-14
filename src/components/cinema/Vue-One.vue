<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>影厅管理</el-breadcrumb-item>
      <el-breadcrumb-item>一号厅</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 影厅信息区域 -->
    <div class="cinemaContent">
      <div class="movieBox">
        <div class="movieinfo"></div>
        <div class="movieinfo"></div>
        <div class="movieinfo"></div>
      </div>
      <div class="cinemaBox"></div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.cinemaContent {
  div {
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 5px 10px #ddd;
  }
  .movieBox {
    display: flex;
    justify-content: space-between;
    height: 300px;
    .movieinfo {
      width: 500px;
      background-color: antiquewhite;
    }
  }
  .cinemaBox {
    margin-top: 25px;
    height: 300px;
  }
}
</style>
