<template>
  <!-- 首页主体区域 分顶底两部分-->
  <div class="index-container">
    <!-- 首页顶部个人信息区+柱状图+数据统计 分左右两部分-->
    <div class="container-top-box">
      <!-- 首页顶部左侧个人信息区 分上下两部分 -->
      <div class="avatar card">
        <div class="user-info">
          <!-- 上部分 -->
          <div class="pic">
            <img :src="$store.state.userInfo.user_pic" alt="">
          </div>
          <div class="name">
            <p>{{$store.state.userInfo.username}}</p>
            <p>{{$store.state.userInfo.role}}</p>
          </div>
        </div>
        <!-- 下部分 -->
        <div class="user-time">
          <p>首次注册时间：{{dayjs($store.state.userInfo.creat_time).format("YYYY-MM-DD ")}}</p>
          <p>信息更新时间：{{dayjs($store.state.userInfo.now_time).format("YYYY-MM-DD ")}}</p>
        </div>
      </div>
      <!-- 首页顶部右侧数据统计区 分上下两部分 -->
      <div class="statistical-box">
        <!-- 上部分 -->
        <div class="info-top">
          <!-- 用户数量 -->
          <div class="data card">
            <div class="data-left" style="background:#2d8cf0">
              <i class="el-icon-user icon"></i>
            </div>
            <div class="data-right">
              <p>用户数量</p>
              <p style="color:#2d8cf0">{{userSum.userSum}}</p>
            </div>
          </div>
          <!-- 今日订单 -->
          <div class="data card">
            <div class="data-left" style="background:#64d572">
              <i class="el-icon-tickets icon"></i>
            </div>
            <div class="data-right">
              <p>今日订单</p>
              <p style="color:#64d572">{{orderToday}}</p>
            </div>
          </div>
          <!-- 累计订单 -->
          <div class="data card">
            <div class="data-left" style="background:#f25e43">
              <i class="el-icon-document-copy icon"></i>
            </div>
            <div class="data-right">
              <p>累计订单</p>
              <p style="color:#f25e43">{{datas.orderSum}}</p>
            </div>
          </div>
          <!-- 累计营业额 -->
          <div class="data card" style="margin-right:0">
            <div class="data-left" style="background:#fe8b8e">
              <i class="el-icon-s-finance icon"></i>
            </div>
            <div class="data-right">
              <p>累计营业额</p>
              <p style="color:#fe8b8e">{{datas.priceSum}}</p>
            </div>
          </div>
        </div>
        <!-- 下部分 -->
        <div ref="columnarDom" class="info-bottom card">
        </div>
      </div>
    </div>
    <!-- 首页底部日历区+折线图+时钟+饼图 分左中右三部分 -->
    <div class="container-top-bottom">
      <!-- 首页底部左部分日历区 -->
      <div class="data-left card">
        <el-calendar v-model="value"></el-calendar>
      </div>
      <!-- 首页底部中部分折线图 -->
      <div ref="lineDom" class="data-middle card"></div>
      <!-- 首页底部右部分时钟+饼图 分上下两部分 -->
      <div class="data-right">
        <!-- 上部分-->
        <div class="data-right-top card">{{nowTime}}</div>
        <!-- 下部分-->
        <div ref="pieDom" class="data-right-bottom card"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 导入echarts图表

// import { TooltipComponent, ToolboxComponent, TitleComponent, GridComponent, LegendComponent } from 'echarts/components'
// import { PieChart, BarChart, LineChart } from 'echarts/charts'
// import { LabelLayout, UniversalTransition } from 'echarts/features'
// import { CanvasRenderer } from 'echarts/renderers'
// 导入element-resize-detector 插件
import elementResizeDetectorMaker from 'element-resize-detector'
// this.echarts.use([
//   GridComponent,
//   TitleComponent,
//   ToolboxComponent,
//   TooltipComponent,
//   LegendComponent,
//   LineChart,
//   BarChart,
//   PieChart,
//   UniversalTransition,
//   CanvasRenderer,
//   LabelLayout
// ])
// import debounce from '@/utils/debounce'
export default {
  data () {
    return {
      value: new Date(),
      timer: '', // 定义一个定时器的变量
      nowTime:
        new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), // 获取当前时间
      erd: null,
      datas: {
        orderSum: '',
        priceSum: ''
      },
      userSum: '',
      orderToday: '0'

    }
  },
  created () {
    this.getTime()
    this.getData()
  },
  mounted () {
    this.bar() // 重绘图表
    this.initCharts()// 初始化图表
    this.initEchartsRrsize()// 根据大小初始化图表
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
    // 离开页面删除检测器和所有侦听器
    elementResizeDetectorMaker().uninstall(document.querySelector('.el-main'))
  },
  methods: {
    async getData () {
      const { data: res } = await this.$http.get('getdata')
      if (res.status !== 0) return this.$message.error('获取数据失败')
      this.datas = res.data2[0]
      this.userSum = res.data[0]
    },
    // 获取时间
    getTime () {
      // 时钟
      this.timer = setInterval(() => {
        const hour = this.appendZero(new Date().getHours())
        const minute = this.appendZero(new Date().getMinutes())
        const second = this.appendZero(new Date().getSeconds())
        // 修改数据date
        this.nowTime = hour + ':' + minute + ':' + second
      }, 1000)
    },
    // 时间过滤加0
    appendZero (obj) {
      if (obj < 10) {
        return '0' + obj
      } else {
        return obj
      }
    },
    bar () {
      this.chartColumnarSize = this.echarts.init(this.$refs.columnarDom)
      this.chartLineSize = this.echarts.init(this.$refs.lineDom)
      this.chartPieSize = this.echarts.init(this.$refs.pieDom)
    },
    // 初始化图表
    initCharts () {
      // 柱状图表
      const myChartColumnar = this.echarts.init(this.$refs.columnarDom)
      // 饼状图表
      const myChartPie = this.echarts.init(this.$refs.pieDom)
      // // 折线图
      const myChartLine = this.echarts.init(this.$refs.lineDom)
      this.showChart(myChartColumnar, myChartPie, myChartLine)
    },
    // 展示图表
    showChart (myChartColumnar, myChartPie, myChartLine) {
      // 柱状图
      const optionColumnar = {

        title: {
          text: '电影热榜'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
        },
        grid: {
          top: '18%',
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['暗影视界', '狂暴3', '青春不重返']
        },
        series: [{
          type: 'bar',
          data: [200, 600, 700],
          itemStyle: {
            normal: { // 这里是重点
              color: function (params) {
                // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                const colorList = ['#5470c6', '#91cc75', '#ee6666']
                return colorList[params.dataIndex]
              }
            }
          }
        }

        ]
      }
      // 使用刚指定的配置项和数据显示图表
      myChartColumnar.setOption(optionColumnar)
      // 饼图
      const optionPie = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '0',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表
      myChartPie.setOption(optionPie)
      // 折线图
      const optionLine = {
        color: ['red', '#fac858'],
        title: {
          text: '上周营业情况',
          top: '2%',
          left: '3%',
          right: '4%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['订单数', '销售额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        },
        yAxis: {
          type: 'value'

        },
        series: [{
          name: '订单数',
          type: 'line',
          stack: 'Total',
          data: [259, 787, 126, 536, 423, 1658, 325]
        }, {
          name: '销售额',
          type: 'line',
          stack: 'Total',
          data: [823, 1688, 425, 1500, 1243, 3658, 1100]
        }

        ]
      }
      // 使用刚指定的配置项和数据显示图表
      myChartLine.setOption(optionLine)
    },
    // 根据大小改变图表大小
    initEchartsRrsize () {
      setTimeout(() => {
        const erd = elementResizeDetectorMaker()
        erd.listenTo(document.querySelector('.el-main'),
          () => {
            // const width = element.offsetWidth
            this.$nextTick(function () {
              // 使echarts尺寸重置
              this.chartColumnarSize.resize()
              this.chartLineSize.resize()
              this.chartPieSize.resize()
            })
          })
      }, 1000)
    }
  }
}

</script>
<style lang="less" scoped>
.card {
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 5px 10px #ddd;
  padding: 20px;
}
.data,
.avatar,
.data-left,
.data-middle {
  margin-right: 25px;
}
@width: 450px;
.container-top-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  .avatar {
    width: @width;
    height: 300px;
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 120px;
      margin-bottom: 40px;
      .pic {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #2b4b6b;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .name {
        flex: 1;
        text-align: center;

        p:nth-child(1) {
          font-size: 30px;
          margin: 15px 0;
        }
        p:nth-child(2) {
          font-size: 16px;
          color: #999;
        }
      }
    }
    .user-time {
      border-top: 2px solid #999;
      p {
        font-size: 18px;
        color: #999;
      }
    }
  }

  .statistical-box {
    width: 100%;
    .info-top {
      display: flex;
      justify-content: space-between;
      height: 100px;
      margin-bottom: 25px;
      .data {
        flex: 1;
        padding: 0;
        display: flex;

        .data-left {
          height: 100px;
          margin-right: 0;
          border-radius: 10px 0 0 10px;
          .icon {
            width: 100px;
            text-align: center;
            font-size: 50px;
            color: #fff;
            line-height: 100px;
          }
        }
        .data-right {
          flex: 1;
          text-align: center;
          p:nth-child(2) {
            font-size: 30px;
            font-weight: 700;
            margin: 10px 0;
          }
          p:nth-child(1) {
            font-size: 14px;
            color: #999;
            margin: 15px 0 10px 0;
          }
        }
      }
    }
    .info-bottom {
      min-width: 771px;
      height: 175px;
      padding: 10px;
    }
  }
}
.container-top-bottom {
  display: flex;
  justify-content: space-between;
  min-width: 1025px;
  .data-left {
    width: @width;
    height: 500px;
    /deep/.el-calendar-day {
      height: 54px;
    }
  }
  .data-middle {
    flex: 2;
  }
  .data-right {
    flex: 1;
    .data-right-top {
      height: 100px;
      margin-bottom: 25px;
      font-size: 50px;
      line-height: 60px;
      text-align: center;
    }
    .data-right-bottom {
      height: 375px;
    }
  }
}
</style>
