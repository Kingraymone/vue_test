<template>
  <div>
    <el-row></el-row>
    <el-row></el-row>
    <el-row>
      <el-card style="width: 450px;height: 250px;">
        <div slot="header" class="clearfix">
          <span>华夏中证5G通信主题</span>
          <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
        </div>
        <div id="demo" style="height: 200px;width: 100%"></div>
      </el-card>
      </el-row>
  </div>
</template>

<script>
    import 'echarts/lib/chart/line'
    export default {
        name: "Finance",
        data () {
            return {
                orgOptions: {},
            }
        },
        methods:{
          curDay(){
              let demo = this.$echarts.init(document.getElementById('demo'));
              let option = {
                  title:{
                      text:'当日净值估算图',
                      left: "center"
                  },
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'cross'
                      },
                      formatter: function (params) {
                          // console.log(params); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
                          let baseParam = params[0];
                          let str = '时间：'+baseParam.axisValue+ '<br>' +'收益率：'+baseParam.data+'%';
                          return str;
                      }
                  },

                  axisPointer: {
                      link: {xAxisIndex: 'all'},
                      label: {
                          backgroundColor: '#777'
                      }
                  },
                  xAxis: {
                      type: 'category',
                      data: ['9:30','10:30', '11:30/13:00', '14:00', '15:00'],
                      name:'时间',
                      boundaryGap:false,// 去除坐标轴留白
                      axisTick: {  //去掉坐标轴刻线
                          show: false
                      },

                  },
                  yAxis: {
                      type: 'value',
                      /*scale:true,*/
                      splitLine:{show: false},//去除网格线
                      /*boundaryGap: ['20%', '20%'],*/
                      minInterval:0.004,
                      min:1.231*0.99,
                      max:1.231*1.01,
                      axisLabel: {
                          formatter:function (value, index) {
                              return value.toFixed(4);
                          }
                      }
                  },
                  series: [{
                      data: [1.231, 1.232, 1.226, 1.233, 1.235, 1.234, 1.300],
                      type: 'line',
                      showSymbol: false,
                      hoverAnimation: false,
                      smooth:true,//平滑
                      symbol: 'none',

                      markLine: { //基准线
                          symbol: ['none', 'none'],//去掉箭头
                          silent: true,
                          precision:4,
                          lineStyle: {
                              normal: {
                                  color: '#01fef9'
                              }
                          },
                          data: [{
                              yAxis:1.2312
                          }]
                      }
                  }]
              };



              demo.setOption(option);
          }
        },
        mounted() {
          this.curDay();
        }
    }
</script>

<style scoped>

</style>
