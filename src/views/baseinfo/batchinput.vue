<template>
<section>
  <!--工具条-->
  <el-row>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-upload class="upload-demo" drag action="/insiis/pages/insuredmgmt/aloneinjury/AloneInjuryapi.jsp?method=upLoadExcel" :on-success="uploadSucc" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
      </el-upload>
      <el-button type="primary" style="float:right;" @click="downLoadExcel">下载模板文件<i class="el-icon-document el-icon--right"></i></el-button>
    </el-col>

  </el-row>
  <!--列表-->
  <el-table :data="users" highlight-current-row v-loading="listLoading" :row-class-name="failcolor" @selection-change="selsChange" border height="400" style="width: 100%;">
    <el-table-column type="selection" width="55" :selectable="selectabler">
    </el-table-column>
    <el-table-column type="index" width="65">
    </el-table-column>
    <el-table-column prop="aac003" label="姓名" width="100" sortable>
    </el-table-column>
    <el-table-column prop="aac004_s" label="性别" width="75" :formatter="formatSex" sortable>
    </el-table-column>
    <el-table-column prop="aac004" label="性别" width="75" v-if="column_show" sortable>
    </el-table-column>
    <el-table-column prop="aae135" label="身份证" width="180" sortable>
    </el-table-column>
    <el-table-column prop="aac006" label="生日" width="120" sortable>
    </el-table-column>
    <el-table-column prop="aac009_s" label="户口性质" min-width="120" :formatter="formatAac009" sortable>
    </el-table-column>
    <el-table-column prop="aac009" label="户口性质" v-if="column_show" min-width="120" sortable>
    </el-table-column>
    <el-table-column prop="eac101" label="联系电话" min-width="120" sortable>
    </el-table-column>
    <el-table-column prop="value" label="错误信息" min-width="180" sortable>
    </el-table-column>
    <el-table-column prop="aaz308" label="业务id" v-if="column_show" min-width="120" sortable>
    </el-table-column>
    <el-table-column prop="aac001" label="人员id" v-if="column_show" min-width="120" sortable>
    </el-table-column>
  </el-table>

  <!--工具条-->
  <el-col :span="24" class="toolbar">
    <el-button type="danger" @click="batchUpload" :disabled="this.sels.length===0">批量导入</el-button>
  </el-col>

</section>
</template>
<style>
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .fail-row {
  background: red;
}
</style>
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
      filterss: [],
      users: [],
      login_user: [],
      total: 0,
      page: 1,
      failcolor: '',
      listLoading: false,
      searchinfo: '',
      sels: [], //列表选中列
      column_show: false,
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
    }
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.aac004 == '1' ? '男' : row.aac004 == '2' ? '女' : '未知';
    },
    formatAac009: function(row, column) {
      return row.aac009 == '10' ? '本地城镇' : row.aac009 == '20' ? '本地农村' : row.aac009 == '11' ? '外地城镇' : row.aac009 == '21' ? '外地农村' : '未知';
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    selsChange: function(sels) {
      this.sels = sels;
    },

    uploadSucc: function(response, file, fileList) { //上传完返回
      this.users = response.obj;
      this.failcolor = '';
    },
    //批量上传
    batchUpload: function() {
      // var ids = this.sels.map(item => item.aaz308).toString();
      // console.log(ids);
      var mydate=new Date();
      var nowdate=util.formatDate.format(mydate,'yyyyMMdd');
      if(this.login_user.bae053<nowdate){
        this.$message.error('工程已到期，不能进行新增操作！工程到期时间：'+this.login_user.bae053);
        return;
      }

      this.$confirm('确认上传选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        let newusers = [];
        this.total = 0;
        let j=0;
        for (var i = 0; i < this.sels.length; i++) {
          let para = Object.assign({}, this.sels[i]);
          para.method = 'addPerson';
          para.aaz001 = this.login_user.aaz001;
          addPerson(para).then((res) => {

            //NProgress.done();
            if (res.data.code == '200') {
              this.total++;
              console.log(this.total + " 11");
            } else {
              para.value = "上传失败:" + res.data.msg;
              newusers.push(para);
            }
          }).then(() => {
            j++;
            if (j >= this.sels.length ) {
              this.listLoading = false;
              this.users = newusers; //失败信息在列表显示
              this.failcolor = 'fail-row';
              this.$message({
                message: '提交成功' + this.total + '条',
                type: 'success'
              });
            }
          });
          //  console.log(newusers);
        }


      }).catch(() => {

      });
    },
    selectabler: function(row, index) { //控制能否勾选

      if (row.value.length > 0) {
        return false;
      } else {
        return true;
      }

    },
    downLoadExcel: function() {
      window.location.href = "/static/addnew.xls";
    }
  },
  mounted() {
    var loginuser = sessionStorage.getItem('user');
    if (loginuser) {
      this.login_user = JSON.parse(loginuser);
    }


  }
}
</script>

<style scoped>

</style>
