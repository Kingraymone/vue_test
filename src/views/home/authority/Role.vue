<template>
  <div>
    <!--首部-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-s-custom"></i> 角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="myContainer">
      <!--表单搜索-->
      <el-row type="flex">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div>
            <el-form :inline="true">
              <el-form-item label="角色代码">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchTab.roleCode"
                  clearable
                  size="small"
                  prefix-icon="el-icon-search">
                </el-input>
              </el-form-item>
              <el-form-item label="角色状态">
                <el-select
                  v-model="searchTab.status"
                  multiple
                  collapse-tags
                  clearable
                  size="small"
                  placeholder="请选择">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="冻结" value="1"></el-option>
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
      <el-row>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small"
                           type="primary"
                           icon="el-icon-setting"
                           circle
                           @click="handleAuthority(scope.$index, scope.row)">
                  权限管理
                </el-button>
              </template>
            </el-table-column>
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
            <el-form-item label="角色代码" prop="roleCode">
              <el-input v-model="addForm.roleCode" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="描述" prop="statement">
              <el-input v-model="addForm.statement"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="角色名" prop="rolename">
              <el-input placeholder="请输入角色名" v-model="addForm.rolename"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="addForm.status"
                clearable
                placeholder="请选择">
                <el-option label="正常" value="0"></el-option>
                <el-option label="冻结" value="1"></el-option>
              </el-select>
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
            <el-form-item label="角色代码" prop="roleCode">
              <el-input v-model="editForm.roleCode" maxlength="50" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="描述" prop="statement">
              <el-input v-model="editForm.statement"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="角色名" prop="rolename">
              <el-input placeholder="请输入角色名" v-model="editForm.rolename"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="editForm.status"
                clearable
                placeholder="请选择">
                <el-option label="正常" value="0"></el-option>
                <el-option label="冻结" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editSubmitForm('editForm')">提 交</el-button>
      </div>
    </el-dialog>
    <!--权限修改-->
    <el-dialog ref="editDialog" title="权限修改"
               width="60%"
               :visible.sync="handleVisible"
               :close-on-click-modal="false"
               @close="closeDialog">
      <el-cascader-panel v-loading="loading" @change="authorityChange" v-model="authority" :options="options"
                         :props="{ multiple: true }" filterable>

      </el-cascader-panel>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editAuthority(authority)">提 交</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
    export default {
        name: "Role",
        data() {
            return {
                curRole: '',
                loading: false,
                authority: [],
                options: [{
                    value: 'sys_home:view',
                    label: '系统首页'
                }, {
                    value: 'sys_user:view',
                    label: '用户管理',
                    children: [{
                        value: 'sys_user:edit',
                        label: '编辑用户信息'
                    }, {
                        value: 'sys_user:view',
                        label: '查看用户信息'
                    }]
                }, {
                    value: 'sys_authority:view',
                    label: '权限管理',
                    children: [{
                        value: 'sys_authority_role:view',
                        label: '角色列表',
                        children: [{
                            value: 'sys_authority_role:view',
                            label: '查看角色信息'
                        }, {
                            value: 'sys_authority_role:edit',
                            label: '修改角色信息'
                        }]
                    }, {
                        value: 'sys_user:view',
                        label: '资源列表'
                    }]
                }],
                handleVisible: false,
                addVisible: false,
                editVisible: false,
                addForm: {
                    roleCode: '',
                    rolename: '',
                    statement: '',
                    status: ''
                },
                editForm: {
                    roleId: '',
                    roleCode: '',
                    rolename: '',
                    statement: '',
                    status: ''
                },
                rules: {
                    roleCode: [
                        {required: true, message: '请输入角色代码', trigger: 'blur'}
                    ],
                    rolename: [
                        {required: true, message: '请输入角色名', trigger: 'blur'}
                    ],
                    statement: [
                        {required: true, message: '请输入描述', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                formLabelWidth: 150,
                searchTab: {
                    roleCode: '',
                    status: []
                },
                tableData: [],
                tcolumn: [
                    {
                        label: '',
                        width: '55',
                        type: 'selection',
                        prop: ''
                    }, {
                        label: '角色代码',
                        width: '120',
                        type: '',
                        prop: 'roleCode',
                        sort: true
                    }, {
                        label: '描述',
                        width: '120',
                        type: '',
                        prop: 'statement',
                        sort: true
                    }, {
                        label: '状态',
                        width: '120',
                        type: '',
                        sort: true,
                        prop: 'status'
                    }, {
                        label: '角色名',
                        type: '',
                        prop: 'rolename'
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
            closeDialog() {
                this.authority = [];
            },
            editAuthority(val) {
                // 将选择的权限信息过滤部分无用的，形成set集合
                let set = new Set();
                val.forEach((list) => {
                    list.filter(function (item) {
                        return item!="*";
                    }).forEach((value) => {
                        set.add(value);
                    })
                });
                let data = {
                    'role': this.curRole,
                    'resources': set
                };
                let _this = this;
                this.$axios.post('/role/updateAuthority', data).then(function (response) {
                    _this.commons.kMessage(response.data.msg, 'success');
                    _this.handleVisible = false;
                }).catch(function (error) {
                })
            },
            authorityChange(val) {
                console.log(JSON.stringify(val));
            },
            handleAuthority(index, row) {
                this.handleVisible = true;
                this.authority = [];
                this.loading = true;
                let _this = this;
                this.$axios.get('/role/authority', {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    params: {
                        roleId: row.roleId
                    }
                }).then(function (response) {
                    _this.curRole = row.roleId;
                    let data = response.data.data;
                    //if (_this.options.length != data.all.length) {
                        _this.options = data.all || [];
                    //}
                    _this.authority = data.role || [];
                    console.info(JSON.stringify(data.role));
                    console.info(JSON.stringify(_this.authority));
                    _this.loading = false;
                }).catch(function (error) {

                });
            },
            selectData() {
                let data = this.searchTab;
                let searchParam = {
                    "pageSize": this.pageSize,
                    "pageNum": this.currentPage,
                    "data": data
                };
                let _this = this;
                _this.$axios.post('/role/search', searchParam)
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
                        this.$axios.post("/role/add", this.addForm)
                            .then(function (response) {
                                _this.commons.kMessage("新增角色成功！", 'success');
                                _this.selectData();
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
                        this.$axios.post("/role/update", this.editForm)
                            .then(function (response) {
                                _this.commons.kMessage("修改角色成功！", 'success');
                                _this.selectData();
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

            handleDelete() {
                if (this.rowSelections.length < 1) {
                    this.commons.kMessage("请选择至少一条数据！", 'info');
                } else {
                    let primaryKey = [];
                    this.rowSelections.forEach(function (item) {
                        primaryKey.push(item.roleId);
                    });
                    let _this = this;
                    this.$axios.post("/role/delete", primaryKey)
                        .then(function (response) {
                            _this.commons.kMessage("删除角色成功！", 'success');
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
                    this.imgVisible = true;
                    this.roleCode = this.rowSelections[0].roleCode;
                }
            },
            resetForm() {
                this.searchTab = {
                    roleCode: '',
                    status: []
                };
            },
            onQuery() {
                this.currentPage = 1;
                this.selectData();
            }
        }
    }
</script>

<style scoped>

</style>
