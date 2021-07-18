<template>
  <div>
    <!--首部-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-s-custom"></i> 基金管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="myContainer">
      <!--表单搜索-->
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div>
            <el-form :inline="true">
              <el-form-item label="基金代码">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchTab.fundcode"
                  clearable
                  size="small"
                  prefix-icon="el-icon-search">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="onQuery">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <!--基本按钮-->
      <el-row>
        <el-button-group>
          <el-tooltip class="item" content="新增">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"></el-button>
          </el-tooltip>
          <el-tooltip class="item" content="修改">
            <el-button type="info" icon="el-icon-edit" @click="handleEdit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" content="删除">
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete"></el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>
      <!--表格-->
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            border
            :header-cell-style="{textAlign: 'center'}"
            :cell-style="{ textAlign: 'center' }"
            :default-sort="{prop: 'setupDate', order: 'descending'}"
            tooltip-effect="dark"
            style="width: 100%;min-height: 300px"
            @selection-change="handleSelectionChange">
            <template v-for="(item,index) in tcolumn">
              <el-table-column
                :label="item.label"
                :width="item.width"
                :type="item.type"
                :prop="item.prop"
                :sortable="item.sort"
                :formatter="item.format"
                :fixed="item.fixed"
                :show-overflow-tooltip='true'
              ></el-table-column>
            </template>
          </el-table>
        </el-col>
      </el-row>
      <!--分页-->
      <el-row style="height: 40px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div style="padding-right: 20px;float: right">
            <el-pagination
              background
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              layout="total,prev, pager, next,jumper"
              @current-change="pageChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--新增表单-->
    <el-dialog ref="addDialog" title="新增"
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
              <el-input v-model="addForm.fundcode" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addSubmitForm('addForm')">提 交</el-button>
      </div>
    </el-dialog>

    <!--修改表单-->
    <el-dialog ref="editDialog" title="修改"
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
            <el-form-item label="基金代码" prop="fundcode">
              <el-input v-model="editForm.fundcode" disabled maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="投资范围" prop="investRange">
              <el-input v-model="editForm.investRange"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editSubmitForm('editForm')">提 交</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
    export default {
        name: "user",
        data() {
            return {
                editVisible: false,
                addVisible: false,
                addForm: {
                    fundcode: ''
                },
                editForm: {
                    uniqueId:'',
                    fundcode: '',
                    investRange:''
                },
                rules: {
                    fundcode: [
                        {required: true, message: '请输入基金账号', trigger: 'blur'},
                        { min: 6, max: 6, message: '长度必须为6位', trigger: 'blur' }
                    ]
                },
                formLabelWidth: 150,
                searchTab: {
                    fundcode: ''
                },
                tableData: [],
                tcolumn: [
                    {
                        label: '',
                        width: '55',
                        type: 'selection',
                        prop: ''
                    }, {
                        label: '基金代码',
                        width: '120',
                        type: '',
                        prop: 'fundcode',
                        sort: true,
                        fixed:"left"
                    }, {
                        label: '基金名称',
                        width: '120',
                        type: '',
                        prop: 'fundname',
                        fixed:"left"
                    }, {
                        label: '投资范围',
                        width: '200',
                        type: '',
                        sort: true,
                        prop: 'investRange'
                    }, {
                        label: '申购费',
                        width: '100',
                        type: '',
                        sort: true,
                        prop: 'purchaseFare'
                    }, {
                        label: '赎回费',
                        width: '100',
                        type: '',
                        prop: 'redeemFare'
                    }, {
                        label: '成立日期',
                        width: '150',
                        type: '',
                        sort: true,
                        prop: 'setupDate',
                        format: this.commons.dateFormat
                    }, {
                        label: '基金经理',
                        width: '120',
                        type: '',
                        prop: 'director'
                    }, {
                        label: '类型',
                        width: '120',
                        type: '',
                        prop: 'fundType'
                    }, {
                        label: '管理人',
                        width: '120',
                        type: '',
                        prop: 'manger'
                    }, {
                        label: '资产规模',
                        width: '120',
                        type: '',
                        prop: 'asset'
                    }, {
                        label: '购买起价',
                        width: '120',
                        type: '',
                        prop: 'purchase'
                    }, {
                        label: '买入确认日',
                        width: '120',
                        type: '',
                        prop: 'bdate'
                    }, {
                        label: '卖出确认日',
                        width: '120',
                        type: '',
                        prop: 'sdate'
                    }, {
                        label: '管理费率',
                        width: '120',
                        type: '',
                        prop: 'manageRatio'
                    }, {
                        label: '托管费率',
                        width: '120',
                        type: '',
                        prop: 'trusteeRatio'
                    }, {
                        label: '销售服务费率',
                        width: '',
                        type: '',
                        prop: 'serviceRatio'
                    }
                ],
                rowSelections: [],
                total: 0,
                pageSize: 10,
                currentPage: 1
            }
        },
        /*created() {
            this.selectData();
        },*/
        methods: {
            selectData() {
                let data = this.searchTab;
                let searchParam = {
                    "pageSize": this.pageSize,
                    "pageNum": this.currentPage,
                    "data": data
                };
                let _this = this;
                _this.$axios.post('/fund/search', searchParam)
                    .then(function (response) {
                        _this.tableData = response.data.data;
                        _this.total = response.data.count
                    })
                    .catch(function (error) {

                    });
            },
            pageChange(val) {
                // 当前页改变，重新查询
                this.currentPage = val;
                this.selectData();
                console.info(val);
            },
            handleSelectionChange(val) {
                this.rowSelections = val;
            },
            handleAdd() {
                this.addVisible = true;
            },
            addSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        let data = "fundcode="+this.addForm.fundcode;
                        this.$axios.post("/fund/add",data,{
                            headers:{
                                "Content-Type":"application/x-www-form-urlencoded"
                            }
                        })
                            .then(function(response){
                                _this.commons.kMessage("新增基金成功！", 'success');
                                _this.selectData();
                            })
                            .catch(function(error){
                            });
                        this.addVisible = false;
                        return true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            handleEdit() {
                if (this.rowSelections.length !== 1) {
                    this.commons.kMessage("请选择一条数据！", 'info');
                } else {
                    this.commons.copyProperty(this.editForm, this.rowSelections[0]);
                    this.editVisible = true;
                }
            },
            editSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        this.$axios.post("/fund/edit",this.editForm)
                            .then(function(response){
                                _this.commons.kMessage("修改基金成功！", 'success');
                                _this.selectData();
                            })
                            .catch(function(error){
                            });
                        this.editVisible = false;
                        return true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            handleDelete() {
                if (this.rowSelections.length < 1) {
                    this.commons.kMessage("请选择至少一条数据！", 'info');
                } else {
                    let primaryKey = [];
                    this.rowSelections.forEach(function(item){
                        primaryKey.push(item.uniqueId);
                    });
                    let _this = this;
                    this.$axios.post("/fund/delete", { primaryKey})
                        .then(function (response) {
                            _this.commons.kMessage("删除基金成功！", 'success');
                            _this.currentPage = 1;
                            _this.selectData();
                        })
                        .catch(function (error) {
                        });
                }
            },

            iconUpload() {
                if (this.rowSelections.length !== 1) {
                    this.commons.kMessage("请选择一条数据！", 'info');
                } else {
                    this.imgVisible=true;
                    this.username=this.rowSelections[0].username;
                }
            },
            resetForm() {
                this.searchTab = {
                    username: '',
                    createTime: '',
                    status: []
                };
            },
            onQuery() {
                this.currentPage=1;
                this.selectData();
            }
        }
    }
</script>

<style scoped>

</style>
