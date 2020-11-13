<template>
  <!--<div class="mdl-card mdl-card&#45;&#45;horizontal">
    <div class="mdl-card__media">
      <img src="https://www.cnblogs.com/favicon.ico" alt="img">
    </div>
    <p style="font-size: 20px;padding-top: 5px;"><b>博客园</b></p>
    <div class="mdl-card__supporting-text">
      博客发布地fdsasaafdsa址...
    </div>
  </div>-->
  <div>
    <!--<a href="http://www.baidu.com" target="_blank">
      <el-row class="nav_card">
        <el-col :span="4">
          <div style="line-height: 40px">
            <el-avatar fit="scale-down" size="medium" src="https://www.cnblogs.com/favicon.ico"></el-avatar>
          </div>
        </el-col>
        <el-col :span="20">
          <b>百度</b>
          <p>百度搜索,搜需哦发的萨芬</p>
        </el-col>
      </el-row>
    </a>-->

    <el-row v-for="num in loop" :key="num">
      <el-col v-for="(item,index) in webs" :span="8" :key="index">
        <div v-if="index<num*colNumber&&index>=(num-1)*colNumber" class="nav_card">
          <div class="nav_left">
            <img class="my-favicon" :src="item.host"/>
          </div>
          <div class="nav_middle">
            <a :href="item.weburl" target="_blank">
              <div style="margin-top: 10px"><b>{{item.title}}</b></div>
              <div>
                <p :title="item.memo">{{item.memo}}</p>
              </div>
            </a>
          </div>
          <div class="nav_right">
            <el-button @click="deleteSite(item.uniqueId)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
            <!--<span>test</span>-->
          </div>
        </div>
      </el-col>
    </el-row>


    <el-row class="particular-button">
      <button @click="showAdd" class="learn-more">网站添加</button>
    </el-row>

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
            <el-form-item label="标题" prop="title">
              <el-input v-model="addForm.title" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="链接" prop="weburl">
              <el-input placeholder="http//:" v-model="addForm.weburl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详情" prop="memo">
              <el-input v-model="addForm.memo"></el-input>
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
    <!--<el-dialog ref="editDialog" title="修改"
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
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" maxlength="10" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="editForm.nickname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="密码" prop="password">
              <el-input placeholder="请输入密码" v-model="editForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="座右铭" prop="motto">
              <el-input v-model="editForm.motto"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="editForm.mail"></el-input>
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
    </el-dialog>-->

  </div>
</template>

<script>
    export default {
        name: "Navigation",
        data() {
            return {
                addVisible: false,
                editVisible: false,
                addForm: {
                    title: '',
                    memo: '',
                    weburl: ''
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    memo: [
                        {required: true, message: '请输入详细介绍', trigger: 'blur'}
                    ],
                    weburl: [
                        {required: true, message: '请输入url', trigger: 'blur'},
                        {pattern: '^(?:(?:https?)://)(?:(?:1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])(?:\\.(?:1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)){2}(?:\\.(?:1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*)(?::([1-9]|[1-9]\\d|[1-9]\\d{2}|[1-9]\\d{3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5]))?(?:/\\S*)?$', message: '请输入正确的url', trigger: 'blur'}
                    ]
                },
                formLabelWidth: 150,
                webs: [],
                loop: 1,
                colNumber: 3
            }
        },
        created() {
            this.selectData();
        },
        methods: {
            showAdd() {
                this.addVisible = true;
            },
            addSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        this.addForm.host=new URL(this.addForm.weburl).origin+'/favicon.ico';
                        this.$axios.post("/website/add", this.addForm)
                            .then(function (response) {
                                _this.commons.kMessage("新增网站成功！", 'success');
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
            selectData() {
                let _this = this;
                this.$axios.get('/website/search')
                    .then(function (response) {
                        _this.webs = response.data.data;
                        _this.loop = Math.floor((_this.webs.length - 1) / 3) + 1;
                    }).catch(function (error) {

                    }
                )
            },
            deleteSite(val) {
                let _this = this;
                let data = "uniqueId="+val;
                this.$axios.post('/website/delete',data,{
                    headers:{
                      'Content-Type':'application/x-www-form-urlencoded'
                    }
                }).then(function(response){
                    _this.commons.kMessage("删除网站成功！", 'success');
                    _this.selectData();
                }).catch(function (error){

                })
            }
        }
    }
</script>

<style lang="scss" scoped>
  .nav_middle a {
    text-decoration: none;
  }

  .nav_middle p {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    bottom: 0;
    color: #6a737d;
    font-size: small;
  }

  .my-favicon {
    width: auto;
    height: 50px;
    padding: 5px;
    border: #6a737d;
    border-radius: 5px;
  }

  .nav_card {
    box-sizing: border-box;
    background-color: rgba(157, 145, 166, 0.25);
    height: 60px;
    width: 300px;
    border-radius: 5px;
    margin: 5px;
    display: flex;
    float: left;
  }

  .nav_card:hover {
    opacity: 1;
    background-color: rgba(157, 145, 166, 0.53);
    transition: 0.4s, 0.8s;
  }

  .nav_left {
    line-height: 60px;
    height: 60px;
    width: 50px;
  }

  .nav_middle {
    flex: 1;
    height: 60px;
  }

  .nav_right {
    height: 60px;
    line-height: 60px;
    width: 30px;
  }


  @import url('https://fonts.googleapis.com/css?family=Rubik:700&display=swap');

  $bg: #fff;
  $text: #382b22;
  $light-pink: #fff0f0;
  $pink: #ffe9e9;
  $dark-pink: #f9c4d2;
  $pink-border: #b18597;
  $pink-shadow: #ffe3e2;

  * {
    box-sizing: border-box;

    &::before, &::after {
      box-sizing: border-box;
    }
  }


  .particular-button button {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
    font-size: inherit;
    font-family: inherit;

    &.learn-more {
      font-weight: 600;
      color: $text;
      text-transform: uppercase;
      padding: 1.25em 2em;
      background: $light-pink;
      border: 2px solid $pink-border;
      border-radius: 0.75em;
      transform-style: preserve-3d;
      transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1);

      &::before {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: $dark-pink;
        border-radius: inherit;
        box-shadow: 0 0 0 2px $pink-border, 0 0.625em 0 0 $pink-shadow;
        transform: translate3d(0, 0.75em, -1em);
        transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
      }

      &:hover {
        background: $pink;
        transform: translate(0, 0.25em);

        &::before {
          box-shadow: 0 0 0 2px $pink-border, 0 0.5em 0 0 $pink-shadow;
          transform: translate3d(0, 0.5em, -1em);
        }
      }

      &:active {
        background: $pink;
        transform: translate(0em, 0.75em);

        &::before {
          box-shadow: 0 0 0 2px $pink-border, 0 0 $pink-shadow;
          transform: translate3d(0, 0, -1em);
        }
      }
    }
  }

</style>
