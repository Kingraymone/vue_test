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
    <el-row style="margin-top: 20px">
      <el-col :span="18">
        <div id="curDay" style="height: 250px;min-width: 400px"></div>
      </el-col>
      <el-col :span="5" :offset="1">
        <ul>
          <li>
            <div class="myFrame">
              <ul>
                <li><strong>持仓份额</strong></li>
                <li>{{holdShare}}</li>
              </ul>
            </div>
            <div class="myFrame">
              <ul>
                <li><strong>持仓成本</strong></li>
                <li>{{holdNetValue}}</li>
              </ul>
            </div>
          </li>
          <li>
            <div class="myFrame">
              <ul>
                <li><strong>实时收益率</strong></li>
                <li :style="{color:realTimeProfitRatio>=0?'red':'green'}">{{realTimeProfitRatio}}%</li>
              </ul>
            </div>
            <div class="myFrame">
              <ul>
                <li><strong>实时收益</strong></li>
                <li :style="{color:realTimeProfit>=0?'red':'green'}">{{realTimeProfit}}</li>
              </ul>
            </div>
          </li>
          <li>
            <div class="myFrame2">
              <el-button @click="handleAdd" round size="small" type="danger" icon="el-icon-circle-plus">申购</el-button>
            </div>
            <div class="myFrame2">
              <el-button @click="handleEdit" round size="small" type="success" icon="el-icon-remove">赎回</el-button>
            </div>
          </li>
          <li>
            <div class="myFrame2">
              <el-button @click="dialogTableVisible2=true" round size="small" type="info" icon="el-icon-info">详情
              </el-button>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <div id="historyDay" style="height: 250px;min-width: 400px"></div>
      </el-col>
      <el-col :span="5" :offset="1">
        <ul>
          <li>
            <div class="myFrame">
              <ul>
                <li><strong>历史收益率</strong></li>
                <li :style="{color:historyProfitRatio>=0?'red':'green'}">{{historyProfitRatio}}%</li>
              </ul>
            </div>
            <div class="myFrame">
              <ul>
                <li><strong>历史收益</strong></li>
                <li :style="{color:historyProfit>=0?'red':'green'}">{{historyProfit}}</li>
              </ul>
            </div>
          </li>
          <li>
            <div class="myFrame2">
              <el-button @click="dialogTableVisible=true" round size="small" type="info" icon="el-icon-info">详情
              </el-button>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>

    <!--新增表单-->
    <el-dialog ref="addDialog" title="基金申购"
               width="40%"
               :visible.sync="addVisible"
               :close-on-click-modal="false">
      <el-form ref="addForm"
               :model="addForm"
               :rules="rules"
               size="mini"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="基金代码" prop="fundcode">
              <el-input v-model="addForm.fundcode" maxlength="10" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="申购金额" prop="pbalance">
              <el-input v-model="addForm.pbalance"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请日期" prop="drequest">
              <el-date-picker
                v-model="addForm.drequest"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addSubmitForm('addForm')">提 交</el-button>
      </div>
    </el-dialog>
    <!--修改表单-->
    <el-dialog ref="editDialog" title="基金赎回"
               width="40%"
               :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form ref="editForm"
               :model="editForm"
               :rules="rules"
               size="mini"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="剩余份额" prop="curredeem">
              <el-input v-model="editForm.curredeem" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="基金代码" prop="fundcode">
              <el-input v-model="editForm.fundcode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请日期" prop="drequest">
              <el-date-picker
                v-model="editForm.drequest"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="赎回份额" prop="rfare">
              <el-input v-model="editForm.rfare"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editSubmitForm('editForm')">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="历史收益详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="fundcode" label="基金代码" width="150"></el-table-column>
        <el-table-column property="drequest" label="申请日期" width="150" sortable="true"
                         :formatter="this.commons.dateFormat"></el-table-column>
        <el-table-column property="ddate" label="确认日期" width="150" sortable="true"
                         :formatter="this.commons.dateFormat"></el-table-column>
        <el-table-column property="balances" label="赎回金额" width="150"></el-table-column>
        <el-table-column property="original" label="原始金额"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="申购详情" :visible.sync="dialogTableVisible2">
      <el-table :data="gridData2">
        <el-table-column property="fundcode" label="基金代码" width="150"></el-table-column>
        <el-table-column property="drequest" label="申请日期" width="150" sortable="true"
                         :formatter="this.commons.dateFormat"></el-table-column>
        <el-table-column property="ddate" label="确认日期" width="150" sortable="true"
                         :formatter="this.commons.dateFormat"></el-table-column>
        <el-table-column property="holdday" label="持有天数" width="150"></el-table-column>
        <el-table-column property="original" label="申购金额" width="150"></el-table-column>
        <el-table-column property="purchase" label="申购费" width="150"></el-table-column>
        <el-table-column property="shares" label="确认份额" width="150"></el-table-column>
        <el-table-column property="rfare" label="剩余份额"></el-table-column>
      </el-table>
    </el-dialog>
  </div>


</template>

<script>
    import 'echarts/lib/chart/line'

    export default {
        name: "Finance",
        watch: {
            dialogTableVisible() {
                if (this.dialogTableVisible) {
                    let _this = this;
                    this.$axios.get('/netvalue/detail', {
                        params: {
                            fundcode: this.fundcode,
                            type: '1'
                        }
                    }).then(function (response) {
                        _this.gridData = response.data.data;
                    }).catch(function (error) {

                    })
                }
            },
            dialogTableVisible2() {
                if (this.dialogTableVisible2) {
                    let _this = this;
                    this.$axios.get('/netvalue/detail', {
                        params: {
                            fundcode: this.fundcode,
                            type: '0'
                        }
                    }).then(function (response) {
                        _this.gridData2 = response.data.data;
                        let nextDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                        for (let i = 0; i < _this.gridData2.length; i++) {
                            let ddate = _this.gridData2[i].ddate+"";
                            let purDate = new Date(ddate.substring(0, 4), ddate.substring(4, 6)-1, ddate.substring(6, 8));
                            _this.gridData2[i].holdday = Math.floor((nextDate - purDate) / (24 * 3600 * 1000));
                        }
                    }).catch(function (error) {

                    })
                }
            }
        },
        data() {
            let _this = this;
            let validateShare = (rule, value, callback) => {
                if (!Number(value)) {
                    callback(new Error('请输入数字！'));
                }
                if (Number(value) <= Number(_this.holdShare)) {
                    callback();
                } else {
                    callback(new Error('赎回份额必须小于持有份额！'));
                }
            };
            return {
                dialogTableVisible2: false,
                dialogTableVisible: false,
                addVisible: false,
                editVisible: false,
                addForm: {
                    fundcode: '',
                    pbalance: '',
                    drequest: '',
                    businessType: '0'
                },
                editForm: {
                    curredeem: '',
                    fundcode: '',
                    rfare: '',
                    drequest: '',
                    businessType: '1'
                },
                rules: {
                    fundcode: [
                        {required: true, message: '请输入基金代码', trigger: 'blur'}
                    ],
                    pbalance: [
                        {required: true, message: '请输入申购金额', trigger: 'blur'}
                    ],
                    drequest: [
                        {required: true, message: '请输入申请日期', trigger: 'blur'}
                    ],
                    rfare: [
                        {required: true, message: '请输入赎回份额', trigger: 'blur'},
                        {validator: validateShare, trigger: 'change'}
                    ]
                },
                formLabelWidth: 150,
                orgOptions: {},
                gridData: [],
                gridData2: [],
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
                fundcode: '',
                historyValues: [],
                baseValue: 0,
                curBaseValue: 1,
                profit: [],
                curDate: [],
                curData: [],
                curNetValue: [],
                timer: '',
                workDay: true,
                // 收益展示字段
                realTimeProfit: '0',
                realTimeProfitRatio: '0',
                historyProfit: '0',
                historyProfitRatio: '0',
                // 后端返回
                holdShare: '0',
                holdNetValue: '0',
                holdBalance: '0',
                purchaseFare: '0',
                // 指数显示
                shangz: '',
                shenz: '',
                ls300: ''
            }
        },
        methods: {
            /*handleDetail(){

            },*/
            handleAdd() {
                this.addVisible = true;
                this.addForm.fundcode = this.fundcode;
            },
            handleEdit() {
                this.editVisible = true;
                this.editForm.fundcode = this.fundcode;
            },
            addSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        this.$axios.post("/netvalue/purchase", this.addForm)
                            .then(function (response) {
                                _this.commons.kMessage(response.data.msg, 'success');
                            })
                            .catch(function (error) {
                            });
                        this.addVisible = false;
                        return true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        this.$axios.post("/netvalue/redeem", this.editForm)
                            .then(function (response) {
                                _this.commons.kMessage(response.data.msg, 'success');
                            })
                            .catch(function (error) {
                            });
                        this.editVisible = false;
                        return true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            timeTask() {
                // 无值默认刷新一次
                if (this.curDate.length < 1) {
                    this.getCurData();
                } else {
                    // 默认执行后为工作日才继续执行
                    if (this.workDay) {
                        let date = new Date();
                        // 行情时间内才执行
                        if (date.getHours() >= 9 && date.getHours() < 15) {
                            this.getCurData();
                        }
                    }
                }
            },
            getCurData() {
                // 发送请求并判断是否为工作日
                let _this = this;
                let fundcode = this.fundcode;
                this.$axios.get('/netvalue/current', {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    params: {
                        fundcode: fundcode
                    }
                }).then(function (response) {
                    let data = response.data.data;
                    if (!!data) {
                        let time = data.gztime;
                        let date = time.replace(/-/g, '').substring(0, 8);
                        let rate = data.gszzl;
                        let curNetValue = data.gsz;
                        // 计算实时收益
                        _this.realTimeProfitRatio = _this.holdNetValue == 0 ? 0 : Number((curNetValue - _this.holdNetValue) / _this.holdNetValue * 100).toFixed(3);
                        _this.realTimeProfit = _this.holdBalance == 0 ? 0 : Number((curNetValue - _this.holdNetValue) * _this.holdShare).toFixed(2);
                        _this.curBaseValue = data.dwjz;
                        if (_this.curDate.length < 1) {
                            _this.curDate.push(data.jzrq);
                            _this.curData.push(0);
                            _this.curNetValue.push(data.dwjz);
                        }
                        _this.curDate.push(time);
                        _this.curData.push(rate);
                        _this.curNetValue.push(data.gsz);
                        // 工作日判断
                        const date1 = new Date();
                        let year = date1.getFullYear();
                        let month = date1.getMonth() + 1 + '';
                        month = month.length < 2 ? 0 + month : month;
                        let day = date1.getDate() + '';
                        day = day.length < 2 ? 0 + day : day;
                        if (Number(year + month + day) != date) {
                            _this.workDay = false;
                        }
                        _this.curDay();
                    }
                }).catch(function (error) {

                })
            },
            fundDict() {
                let _this = this;
                this.$axios.get("/fund/dict")
                    .then(function (response) {
                        _this.funds = response.data.data;
                        _this.fundcode = _this.funds[0].value;
                        // 图表数据查询，存在基金代码
                        _this.selectOption(_this.fundcode);
                        // 当日净值查询
                        _this.timeTask();
                    }).catch(function (error) {

                })
            },
            selectOption(val) {
                let _this = this;
                this.$axios.get("/netvalue/profit", {
                    params: {
                        fundcode: val
                    }
                }).then(function (response) {
                    let detail = response.data.data;
                    _this.holdShare = detail.holdShare;
                    _this.editForm.curredeem = detail.holdShare;
                    _this.holdNetValue = detail.holdNetValue;
                    _this.holdBalance = detail.holdBalance;
                    _this.purchaseFare = detail.purchaseFare;
                    _this.holdNetValue = _this.holdShare == 0 ? 0 : Number((Number(_this.holdBalance) + Number(_this.purchaseFare)) / _this.holdShare).toFixed(6);
                    _this.historyProfit = Number(detail.balances - detail.original).toFixed(2);
                    _this.historyProfitRatio = detail.original == 0 ? 0 : Number((detail.balances - detail.original) / detail.original * 100).toFixed(3);
                }).catch(function (erro) {

                })
                this.$axios.get("/netvalue/search", {
                    params: {
                        fundcode: val
                    }
                }).then(function (response) {
                    _this.historyValues = response.data.data;
                    // 当日净值清空
                    _this.curDate = [];
                    _this.curData = [];
                    _this.curNetValue = [];
                    _this.timeTask();
                    _this.history();
                }).catch(function (erro) {

                })
            },
            curDay() {
                let curday = this.$echarts.init(document.getElementById('curDay'));
                let _this = this;
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
                            let netParam = params[1];
                            let str = '时间：' + baseParam.axisValue + '<br>' + '收益率：' + baseParam.data + '%'
                                + '<br>' + '单位净值：' + netParam.data;
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
                        data: _this.curDate,
                        name: '时间',
                        boundaryGap: false,// 去除坐标轴留白
                        axisTick: {  //去掉坐标轴刻线
                            show: false
                        },

                    },
                    yAxis: {
                        type: 'value',
                        scale: true,
                        name: '收益率',
                        /*scale:true,*/
                        splitLine: {show: false},//去除网格线
                        /*boundaryGap: ['20%', '20%'],*/
                        minInterval: 0.001,
                        min: function (value) {
                            return value.min - 1;
                        },
                        max: function (value) {
                            return value.max + 1;
                        },
                        /*splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },*/
                        boundaryGap: [0, '100%'],
                        axisLabel: {
                            formatter: function (value, index) {
                                return value.toFixed(2) + '%';
                            }
                        }
                    },
                    series: [{
                        data: _this.curData,
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        smooth: false,//平滑
                        symbol: 'none',

                        /*markLine: { //基准线
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
                        }*/
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
                            data: _this.curNetValue
                        }]
                };


                curday.setOption(option, true);
            },
            history() {
                let date = [];
                let data = [];
                let net = [];
                let base = 1.0000;
                for (let i = 0; i < this.historyValues.length; i++) {
                    date[i] = this.historyValues[i].cdate;
                    net[i] = this.historyValues[i].netvalue;
                    data[i] = net[i];
                    if (i != 0) {
                        data[i] = Number((data[i] - base) / base * 100).toFixed(4);
                    } else {
                        base = net[i];
                        data[i] = Number(0).toFixed(4);
                    }
                }
                this.profit = data;
                let history = this.$echarts.init(document.getElementById('historyDay'));
                let _this = this;
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0] - 30, '10%'];
                        },
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: function (params) {
                            let baseParam = params[0];
                            let netParam = params[1];
                            let str = '时间：' + baseParam.axisValue +
                                '<br>' + '发行收益率：' + Number(baseParam.data).toFixed(2) + '%' + '<br>' + '单位净值：' + netParam.data
                                + '<br>' + '相对收益率：' + Number((baseParam.data - _this.baseValue)).toFixed(2) + '%';
                            return str;
                        }
                    },
                    title: {
                        left: 'center',
                        text: '历史净值图',
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            myTool1: {
                                show: true,
                                title: '更新历史净值',
                                icon: 'path://M512 919.552c-224.768 0-407.552-182.784-407.552-407.552 0-8.704 0.512-17.408 1.024-26.112l71.68 4.608c-0.512 7.168-0.512 14.336-0.512 21.504 0 185.344 150.528 335.872 335.872 335.872 86.528 0 168.448-32.768 230.912-92.16l49.152 52.224C716.288 880.128 616.96 919.552 512 919.552zM919.552 512h-71.68c0-11.776-0.512-23.552-2.048-35.328-17.92-171.52-161.28-300.544-334.336-300.544-67.584 0-132.096 19.968-187.904 57.344L284.16 174.08c67.072-45.568 145.92-69.632 227.84-69.632 209.408 0 384 156.672 405.504 365.056 1.536 13.824 2.048 28.16 2.048 42.496z',
                                onclick: function () {
                                    _this.updateHistory();
                                }
                            }
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
                        minInterval: 0.01,
                        min: function (value) {
                            return value.min - 1;
                        },
                        max: function (value) {
                            return value.max + 1;
                        },
                        /*splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },*/
                        boundaryGap: [0, '100%'],
                        axisLabel: {
                            formatter: function (value, index) {
                                return value.toFixed(2) + '%';
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
                            /* sampling: 'average',*/
                            itemStyle: {
                                color: 'rgb(131,177,255)'
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
                history.setOption(option, true);
                history.on("dataZoom", function (param) {
                    let start = param.start;
                    if (start == undefined) {
                        start = param.batch[0].start;
                    }
                    let position = Math.round(start * (_this.profit.length / 100.00));
                    _this.baseValue = _this.profit[position];
                });
            },
            updateHistory() {
                let data = 'fundcode=' + this.fundcode;
                let _this = this;
                this.$axios.post('/netvalue/update', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (response) {
                    _this.history();
                    _this.commons.kMessageAtTime("更新历史净值成功！", 'success', 500);
                }).catch(function (error) {

                })
            }
        },
        mounted() {
            this.curDay();
            this.history();
        },
        created() {
            this.fundDict();
            this.timer = setInterval(this.timeTask, 300000);
        },
        beforeDestroy: function () {
            //关闭窗口后清除定时器
            clearInterval(this.timer);
        }
    }
</script>

<style scoped>
  li {
    list-style-type: none
  }

  .myFrame {
    text-align: center;
    float: left;
    margin: 0 0 10px 20px;
    border: 1px solid #404554;
    border-radius: 3px;
    min-width: 80px;
  }

  .myFrame2 {
    text-align: center;
    float: left;
    margin: 0 0 10px 20px;
    min-width: 80px;
  }

</style>
