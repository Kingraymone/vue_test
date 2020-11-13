<template>
  <div>
    <!--首部-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-document-add"></i> 费率设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="myContainer">
      <!--表单搜索-->
      <el-row type="flex">
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
              <el-form-item label="业务类别">
                <el-select
                  v-model="searchTab.businessType"
                  multiple
                  collapse-tags
                  clearable
                  size="small"
                  placeholder="请选择">
                  <el-option label="申购" value="0"></el-option>
                  <el-option label="赎回" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="onQuery">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!--基本按钮-->
      <el-row type="flex">
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
      <el-row >
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            border
            :header-cell-style="{textAlign: 'center'}"
            :cell-style="{ textAlign: 'center' }"
            :default-sort="{prop: 'createTime', order: 'descending'}"
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
                :show-overflow-tooltip='true'
              ></el-table-column>
            </template>
          </el-table>
        </el-col>
      </el-row>
      <!--分页-->
      <el-row type="flex" style="height: 40px">
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
          <el-col :span="10" :offset="4">
            <el-form-item label="业务类型" prop="status">
              <el-select
                v-model="addForm.businessType"
                clearable
                placeholder="请选择">
                <el-option label="申购" value="0"></el-option>
                <el-option label="赎回" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="最低申购金额" prop="minBalance">
              <el-input placeholder="请输入金额" v-model="addForm.minBalance"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="最高申购金额" prop="maxBalance">
              <el-input v-model="addForm.maxBalance"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="最低持有天数" prop="minHoldday">
              <el-input placeholder="请输入天数" v-model="addForm.minHoldday"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="最高持有天数" prop="maxHoldday">
              <el-input v-model="addForm.maxHoldday"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="费率" prop="ratio">
              <el-input v-model="addForm.ratio"></el-input>
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
            <el-form-item label="业务类型" prop="status">
              <el-select
                v-model="editForm.businessType"
                clearable
                placeholder="请选择">
                <el-option label="申购" value="0"></el-option>
                <el-option label="赎回" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="最低申购金额" prop="minBalance">
              <el-input placeholder="请输入金额" v-model="editForm.minBalance"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="最高申购金额" prop="maxBalance">
              <el-input v-model="editForm.maxBalance"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="最低持有天数" prop="minHoldday">
              <el-input placeholder="请输入天数" v-model="editForm.minHoldday"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="最高持有天数" prop="maxHoldday">
              <el-input v-model="editForm.maxHoldday"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="费率" prop="ratio">
              <el-input v-model="editForm.ratio"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
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
        name: "FareRatio",
        data() {
            return {
                addVisible: false,
                editVisible: false,
                addForm: {
                    fundcode: '',
                    businessType: '',
                    minBalance: '',
                    maxBalance: '',
                    minHoldday: '',
                    maxHoldday: '',
                    ratio: ''
                },
                editForm: {
                    uniqueId: '',
                    fundcode: '',
                    businessType: '',
                    minBalance: '',
                    maxBalance: '',
                    minHoldday: '',
                    maxHoldday: '',
                    ratio: ''
                },
                rules: {
                    fundcode: [
                        {required: true, message: '请输入基金代码', trigger: 'blur'}
                    ],
                    businessType: [
                        {required: true, message: '请选择业务类型', trigger: 'blur'}
                    ]
                },
                formLabelWidth: 150,
                searchTab: {
                    fundcode: '',
                    businessType: []
                },
                tableData: [],
                tcolumn: [
                    {
                        label: '',
                        width: '60',
                        type: 'selection',
                        prop: ''
                    }, {
                        label: '基金代码',
                        width: '130',
                        type: '',
                        prop: 'fundcode',
                        sort: true
                    }, {
                        label: '业务类型',
                        width: '130',
                        type: '',
                        prop: 'businessType',
                        sort: true
                    }, {
                        label: '最低申购金额',
                        width: '150',
                        type: '',
                        sort: true,
                        prop: 'minBalance'
                    }, {
                        label: '最高申购金额',
                        width: '150',
                        type: '',
                        sort: true,
                        prop: 'maxBalance'
                    }, {
                        label: '最低持有天数',
                        width: '150',
                        sort: true,
                        type: '',
                        prop: 'minHoldday'
                    }, {
                        label: '最高持有天数',
                        width: '150',
                        type: '',
                        prop:'maxHoldday',
                        sort: true
                    }, {
                        label: '费率',
                        width: '110',
                        type: '',
                        prop:'ratio',
                        sort: true
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
                _this.$axios.post('/fareratio/search', searchParam)
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
                        this.$axios.post("/fareratio/add",this.addForm)
                            .then(function(response){
                                _this.commons.kMessage("新增费率成功！", 'success');
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
                        this.$axios.post("/fareratio/update",this.editForm)
                            .then(function(response){
                                _this.commons.kMessage("修改用户成功！", 'success');
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
                    this.$axios.post("/fareratio/delete", { primaryKey})
                        .then(function (response) {
                            _this.commons.kMessage("删除费率成功！", 'success');
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
                    fundcode: '',
                    businessType: []
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
