<template>
<section>
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="getUsers">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
  </el-col>

  <!--列表-->
  <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border height="500" style="width: 100%;">
    <el-table-column type="selection" width="55">
    </el-table-column>
    <el-table-column type="index" width="65">
    </el-table-column>
    <el-table-column prop="aac003" label="姓名" width="100" sortable>
    </el-table-column>
    <el-table-column prop="aac004" label="性别" width="80" :formatter="formatSex" sortable>
    </el-table-column>
    <el-table-column prop="aae135" label="身份证" width="180" sortable>
    </el-table-column>
    <el-table-column prop="aac006" label="生日" width="120" sortable>
    </el-table-column>
    <el-table-column prop="aae006" label="地址" min-width="180" sortable>
    </el-table-column>
    <el-table-column prop="aae005" label="联系电话" min-width="120" sortable>
    </el-table-column>
    <el-table-column prop="aaz308" label="业务id" v-if="column_show" min-width="120" sortable>
    </el-table-column>
    <el-table-column label="操作" width="80">
      <template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
    </el-table-column>
    <el-table-column prop="caa001" label="录入时间" min-width="180" sortable>
    </el-table-column>
  </el-table>

  <!--工具条-->
  <el-col :span="24" class="toolbar">
    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
    <el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="50" :total="total" style="float:right;">
    </el-pagination>
  </el-col>

</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser,
  querySearchperson,
  addPerson,
  removePerson,
  batchRemovePerson
} from '../../api/api';

export default {
  data() {
    return {
      filters: {
        name: ''
      },
      users: [],
      login_user: [],
      total: 0,
      page: 1,
      listLoading: false,
      searchinfo: '',
      sels: [], //列表选中列
      column_show: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        aae135: [{
          required: true,
          message: '请输入身份证',
          trigger: 'blur'
        }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        aac003: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        aae135: [{
          required: true,
          message: '请输入身份证',
          trigger: 'blur'
        }],
				aac009:[{
          validator: (rule, value, callback) => {
            if (value==-1) {
              callback(new Error("请选择户口性质"));
            } else {
              callback();
            }
          }
        }],
        eac101: [{
          validator: (rule, value, callback) => {
            if (/^\d+$/.test(value) == false&&value.length>0) {
              callback(new Error("只能输入数字"));
            }else if (value.length!=11&&value.length>0) {
            	  callback(new Error("手机号码只能11位"));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }]
      },
      addFormReset:{},
      //新增界面数据
      addForm: {
        aac001:'',
        aac003: '',
        aac004: -1,
        aac009: -1,
        aac006: '',
        aae006: '',
        aae135: '',
        eac101: '',
        aac005: '01',
        aac005_ops: [{
          key: '01',
          value: '汉'
        }]
      }



    }
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.aac004 == '1' ? '男' : row.aac004 == '2' ? '女' : '未知';
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {

      let para = {
        method: 'getUserListPage',
        login_user: this.login_user.aaz001,
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then((res) => {
        this.total = parseInt(res.data.msg);
        this.users = res.data.obj;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = {
          method: 'removePerson',
          aaz308: row.aaz308
        };
        removePerson(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          if(res.data.code=='200'){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          }else{
            this.$message.error(res.data.msg);
          }
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;//页面显示
      this.searchinfo = "";//查询框清空
      this.addForm=Object.assign({}, this.addFormReset);//页面重置
      util.getAa10List('aac005', '').then((res) => { //数据字典
        this.addForm.aac005_ops = res;
        //this.addForm.aac005='01';//默认汉族
      })

    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            editUser(para).then((res) => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.aac006 = (!para.aac006 || para.aac006 == '') ? '' : util.formatDate.format(new Date(para.aac006), 'yyyyMMdd');
            para.method='addPerson';
            para.aaz001=this.login_user.aaz001;
            //console.log(para);
            addPerson(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              if(res.data.code=='200'){
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
              }else{
                this.$message.error(res.data.msg);
              }

              this.$refs['addForm'].resetFields();
              //this.addFormVisible = false;
            // this.getUsers();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.aaz308).toString();
      //  console.log(ids);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = {
          method: 'batchRemovePerson',
          ids: ids
        };
        batchRemovePerson(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    querySearchAsync(queryString, cb) { //远程索搜

      let para = {
        method: 'querySearchperson',
        msg: queryString
      };
      var results = "";
      if (util.strlen(queryString) >= 4) { //如果大于两个中文或4个英文
        //console.log(util.validateIdCard("330283198602180018"));
        querySearchperson(para).then((res) => {
          cb(res.data);
        });
      }

    },
    handleSelect(item) {
      this.addForm = Object.assign({}, item);
			this.addForm.aac004=parseInt(item.aac004);
			this.addForm.aac009=parseInt(item.aac009);
      this.addForm.aac006=util.formatDate.parse(item.aac006.toString(),'yyyyMMdd');
      this.searchinfo='';
      // var test=document.getElementsByTagName('html')[0].outerHTML;
      // console.log(test);
    },
    CheckIdcard: function() {

      if (!util.validateIdCard(this.addForm.aae135) && this.addForm.aae135.length > 0) {
        this.addForm.aae135 = '';
        this.$message.error('身份证验证失败');

      }else if(this.addForm.aac001==''&& this.addForm.aae135.length >= 17){
        let para = {
          method: 'querySearchperson',
          msg: this.addForm.aae135
        };
        querySearchperson(para).then((res) => {
          if(res.data.length==1){
            this.addForm = Object.assign({}, res.data[0]);
      			this.addForm.aac004=parseInt(res.data[0].aac004);
      			this.addForm.aac009=parseInt(res.data[0].aac009);
            this.addForm.aac006=util.formatDate.parse(res.data[0].aac006.toString(),'yyyyMMdd');
          }else if(res.data.length>1){
            // this.addForm=this.addFormReset;
            this.addForm = Object.assign({}, this.addFormReset);
            this.$message.error('该人员在系统中有多条数据，请先在索搜框中查询');
          }else{//根据输入的身份证自动计算性别和出生日期
            let aac004=parseInt(this.addForm.aae135.substr(16,1))%2;//性别
            if(aac004!=1){
              aac004=2;
            }
            this.addForm.aac004=aac004;
            this.addForm.aac006=util.formatDate.parse(this.addForm.aae135.toString().substr(6,8),'yyyyMMdd');
          }
        });
      }
    },
    aae135Change:function(){
      this.addForm.aac001 ='';
    }

  },
  mounted() {
    var loginuser = sessionStorage.getItem('user');
    if (loginuser) {
      this.login_user = JSON.parse(loginuser);
    }
    this.addFormReset=this.addForm;//将新增模块初始值给一个常量，昂便页面重置
    	this.getUsers();
  }
}
</script>

<style scoped>

</style>
