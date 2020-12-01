<template>
  <div>
    <!--首部-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-s-custom"></i> 菜单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="myContainer">
      <!--表单搜索-->
      <el-row type="flex">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div>
            <el-form :inline="true">
              <el-form-item label="菜单名">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchTab.title"
                  clearable
                  size="small"
                  prefix-icon="el-icon-search">
                </el-input>
              </el-form-item>
              <el-form-item label="菜单等级">
                <el-input
                  placeholder="0|1|2"
                  v-model="searchTab.layer"
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
            <el-form-item label="父菜单" prop="parentId">
              <el-input v-model="addForm.parentId" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="菜单名" prop="title">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="addForm.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="菜单路径" prop="url">
              <el-input v-model="addForm.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="排序" prop="orderNum">
              <el-input placeholder="请输入排序" v-model="addForm.orderNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="菜单等级" prop="layer">
              <el-select
                v-model="addForm.layer"
                clearable
                placeholder="请选择">
                <el-option label="一级菜单" value="0"></el-option>
                <el-option label="二级菜单" value="1"></el-option>
                <el-option label="三级菜单" value="2"></el-option>
                <el-option label="四级菜单" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="资源名" prop="resourceCode">
              <el-input v-model="addForm.resourceCode"></el-input>
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
            <el-form-item label="父菜单" prop="parentId">
              <el-input v-model="editForm.parentId" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="菜单名" prop="title">
              <el-input v-model="editForm.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="editForm.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="菜单路径" prop="url">
              <el-input v-model="editForm.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="排序" prop="orderNum">
              <el-input placeholder="请输入排序" v-model="editForm.orderNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="菜单等级" prop="layer">
              <el-select
                v-model="editForm.layer"
                clearable
                placeholder="请选择">
                <el-option label="一级菜单" value="0"></el-option>
                <el-option label="二级菜单" value="1"></el-option>
                <el-option label="三级菜单" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="资源名" prop="resourceCode">
              <el-input v-model="editForm.resourceCode"></el-input>
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
        name: "Menu",
        data() {
            return {
                addVisible: false,
                editVisible: false,
                addForm: {
                    parentId: '',
                    icon: '',
                    url: '',
                    title: '',
                    orderNum: '',
                    resourceCode: '',
                    layer: ''
                },
                editForm: {
                    id: '',
                    parentId: '',
                    icon: '',
                    url: '',
                    title: '',
                    orderNum: '',
                    resourceCode: '',
                    layer: ''
                },
                rules: {
                    parentId: [
                        {required: true, message: '请输入父菜单', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入菜单名', trigger: 'blur'}
                    ],
                    resourceCode: [
                        {required: true, message: '请输入资源代码', trigger: 'blur'}
                    ],
                    layer: [
                        {required: true, message: '请选择菜单等级', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入菜单路径', trigger: 'blur'}
                    ]
                },
                formLabelWidth: 150,
                searchTab: {
                    title: '',
                    layer: ''
                },
                tableData: [],
                tcolumn: [
                    {
                        label: '',
                        width: '55',
                        type: 'selection',
                        prop: ''
                    }, {
                        label: '菜单ID',
                        width: '100',
                        type: '',
                        prop: 'id',
                        sort: true
                    }, {
                        label: '父菜单',
                        width: '120',
                        type: '',
                        prop: 'parentId',
                        sort: true
                    }, {
                        label: '菜单名',
                        width: '120',
                        type: '',
                        prop: 'title',
                        sort: true
                    }, {
                        label: '菜单图标',
                        width: '150',
                        type: '',
                        prop: 'icon',
                        sort: true
                    }, {
                        label: '菜单路径',
                        width: '150',
                        type: '',
                        prop: 'url',
                        sort: true
                    }, {
                        label: '资源代码',
                        width: '150',
                        type: '',
                        prop: 'resourceCode',
                        sort: true
                    }, {
                        label: '菜单等级',
                        width: '120',
                        type: '',
                        sort: true,
                        prop: 'layer'
                    }, {
                        label: '排序',
                        type: '',
                        prop: 'orderNum'
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
                _this.$axios.post('/menu/search', searchParam)
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
                        this.$axios.post("/menu/add",this.addForm)
                            .then(function(response){
                                _this.commons.kMessage("新增菜单成功！", 'success');
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
                        this.$axios.post("/menu/update",this.editForm)
                            .then(function(response){
                                _this.commons.kMessage("修改菜单成功！", 'success');
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
                        primaryKey.push(item.id);
                    });
                    let _this = this;
                    this.$axios.post("/menu/delete", primaryKey)
                        .then(function (response) {
                            _this.commons.kMessage("删除菜单成功！", 'success');
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
                    this.title=this.rowSelections[0].title;
                }
            },
            resetForm() {
                this.searchTab = {
                    title: '',
                    layer: ''
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
