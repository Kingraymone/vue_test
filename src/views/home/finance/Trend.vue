<template>
  <div>
    <el-row>
      <el-select filterable @change="selectOption(fundcode)" v-model="fundcode" placeholder="请选择">
        <el-option
          v-for="item in funds"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <span style="float: left">{{ item.value }}</span>
          <span style="float: right; color: #8492a6; ">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-row>
    <el-row><div id="curDay" style="height: 250px;width: auto"></div></el-row>
    <el-row>
        <div id="historyDay" style="height: 250px;width: auto"></div>
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
                funds: [{
                    value: '008086',
                    label: '华夏中证5G通信主题ETF联接A'
                }, {
                    value: '006875',
                    label: '创金合信恒兴中短债C'
                }, {
                    value: '003547',
                    label: '鹏华丰禄债券'
                }],
                fundcode: '008086',
                historyValues:[]
            }
        },
        methods: {
            fundDict(){
                let _this = this;
                this.$axios.get("/fund/dict")
                    .then(function (response) {
                        _this.funds = response.data.data;
                    }).catch(function (error) {

                })
            },
            selectOption(val) {
                let _this = this;
                this.$axios.get("/netvalue/search", {
                    params: {
                        fundcode: this.fundcode
                    }
                }).then(function (response) {
                    _this.historyValues = response.data.data;
                    _this.history();
                }).catch(function (erro) {

                })
            },
            curDay() {
                let curday = this.$echarts.init(document.getElementById('curDay'));
                let option = {
                    title: {
                        text: '当日净值估算图',
                        left: "center"
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: function (params) {
                            let baseParam = params[0];
                            let str = '时间：' + baseParam.axisValue + '<br>' + '收益率：' + baseParam.data + '%';
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
                        data: ['9:30', '10:30', '11:30/13:00', '14:00', '15:00'],
                        name: '时间',
                        boundaryGap: false,// 去除坐标轴留白
                        axisTick: {  //去掉坐标轴刻线
                            show: false
                        },

                    },
                    yAxis: {
                        type: 'value',
                        /*scale:true,*/
                        splitLine: {show: false},//去除网格线
                        /*boundaryGap: ['20%', '20%'],*/
                        minInterval: 0.004,
                        min: 1.231 * 0.99,
                        max: 1.231 * 1.01,
                        axisLabel: {
                            formatter: function (value, index) {
                                return value.toFixed(4);
                            }
                        }
                    },
                    series: [{
                        data: [1.231, 1.232, 1.226, 1.233, 1.235, 1.234, 1.300],
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        smooth: true,//平滑
                        symbol: 'none',

                        markLine: { //基准线
                            symbol: ['none', 'none'],//去掉箭头
                            silent: true,
                            precision: 4,
                            lineStyle: {
                                normal: {
                                    color: '#01fef9'
                                }
                            },
                            data: [{
                                yAxis: 1.2312
                            }]
                        }
                    }]
                };


                curday.setOption(option);
            },
            history(){
                let date = [];
                let data = [];
                let net = [];
                let base = 1.0000;
                for(let i = 0;i<this.historyValues.length;i++){
                    date[i]=this.historyValues[i].cdate;
                    net[i]=this.historyValues[i].netvalue;
                    data[i]=net[i];
                    if(i!=0){
                        data[i]=Number((data[i]-base)/base*100).toFixed(4);
                    }else{
                        base = net[i];
                        data[i]=Number(0).toFixed(4);
                    }
                }

                let history = this.$echarts.init(document.getElementById('historyDay'));
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: function (params) {
                            let baseParam = params[0];
                            let netParam = params[1];
                            let str = '时间：' + baseParam.axisValue +
                                '<br>' + '收益率：' + baseParam.data +'%'+ '<br>' + '单位净值：' + netParam.data ;
                            return str;
                        }
                    },
                    title: {
                        left: 'center',
                        text: '历史净值图',
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
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
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value',
                        scale: true,
                        splitNumber:6,
                        minInterval:0.01,
                        boundaryGap: [0, '100%'],
                        axisLabel: {
                            formatter: function (value, index) {
                                return value.toFixed(2)+'%';
                            }
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                        start: 0,
                        end: 10
                    }, {
                        start: 0,
                        end: 10,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series: [
                        {
                            name: '收益率',
                            type: 'line',
                            smooth: false,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(255, 70, 131)'
                            },
                            data: data
                        },
                        {
                            name: '单位净值',
                            type: 'line',
                            symbolSize: 0, // symbol的大小设置为0
                            showSymbol: false, // 不显示symbol
                            lineStyle: {
                                width: 0, // 线宽是0
                                color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                            },
                            data: net
                        }
                    ]
                };
                history.setOption(option);
            }
        },
        mounted() {
            this.fundDict();
            this.curDay();
            this.history();
        }
    }
</script>

<style scoped>

</style>
