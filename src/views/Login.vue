<template>
<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">

  <div style="text-align:center">
    <img src="./../assets/logo2.png" />
  </div>

  <h1 class="title_sysinfo">信息录入系统</h1>
  <!--<h3 class="title">系统登录</h3>-->
  <el-form-item prop="account">
    <el-input type="text" v-model="ruleForm2.account" v-focus-next-on-enter="'input2'" auto-complete="off" placeholder="账号"></el-input>
  </el-form-item>
  <el-form-item prop="checkPass">
    <el-input type="password" v-model="ruleForm2.checkPass" ref="input2" @keyup.enter.native="handleSubmit2" auto-complete="off" placeholder="密码"></el-input>
  </el-form-item>
  <div class="slideunlock-wrapper">
    <input type="hidden" value="" class="slideunlock-lockable" />
    <div class="slideunlock-slider">
      <span class="slideunlock-label"></span>
      <span class="slideunlock-lable-tip">Slide to unlock!</span>
    </div>
  </div>
  <el-checkbox class="remember" v-model="rmpwd" @change="change1">记住密码</el-checkbox>

  <el-form-item style="width:100%;">
    <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
    <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
  </el-form-item>
  <!--图片路径写法 第一种能被压缩
	<img src="./../assets/user.png" />
	<img src="/static/img/user.png" />-->
</el-form>
</template>
<style scoped>
/*@import '/static/css/normalize.css';*/
@import '/static/css/slideunlock.css';
</style>
<script src="../../static/js/slideunlock.js" ></script>
<script>
import {
  requestLogin
} from '../api/api';
//import NProgress from 'nprogress'

export default {

  data() {
    return {
      logining: false,
      canLogin: false,
      ruleForm2: {
        account: getCookie("cache_account"),
        checkPass: getCookie("cache_pwd")
      },
      rules2: {
        account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          //{ validator: validaePass }
        ],
        checkPass: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          //{ validator: validaePass2 }
        ]
      },
      rmpwd: getCookie("cache_pwd_checked") == 'true' ? true : false
    }
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    change1() {
      //console.log(this.rmpwd);
    },
    slideunlockSuccess(){//滑动验证成功后调用
      this.canLogin=true;
    },
    handleSubmit2(ev) {

      var _this = this;
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          //_this.$router.replace('/table');
          this.logining = true;
          //NProgress.start();
          //alert(md5_vm_test());

          if(!this.canLogin){
            this.$message({
              message: "请先滑动验证",
              type: 'error'
            });
            this.logining = false;
            return false;
          }
          var loginParams = {
            method: 'login',
            username: this.ruleForm2.account,
            password: hex_md5(this.ruleForm2.checkPass)
          };
          requestLogin(loginParams).then(data => {
            this.logining = false;
            //NProgress.done();
            let msg = data.msg
            let code = data.code
            let user = data.obj
            // let {
            //   msg,
            //   code,
            //   user
            // } = data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              });
            } else {
              setCookie("cache_account", loginParams.username, 30); //记住账号
              if (this.rmpwd) { //是否记住密码
                setCookie("cache_pwd", this.ruleForm2.checkPass, 30);
                setCookie("cache_pwd_checked", this.rmpwd, 30);

              } else {
                setCookie("cache_pwd", '', 30);
                setCookie("cache_pwd_checked", false, 30);
              }
              sessionStorage.setItem('user', JSON.stringify(user));
              this.$router.push({
                path: '/baseinfo'
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  directives: {
    btn: {
      // 指令的定义<el-input type="text" v-model="ruleForm2.account" v-btn=""></el-input>

      //update: function (el,o) {
      // 聚焦元素
      //el.focus();
      //console.log(o.value);
      //}

    }
  },
  filters: { //过滤器
    getstatus: function(rmp) {
      alert(rmp)
      if (rmp == 'true') {
        alert(rmp);
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    ///滑动验证
    this.canLogin=false;
    var slider = new SliderUnlock(".slideunlock-slider", {}, this.slideunlockSuccess, function() {

    });
    slider.init();
    ///滑动验证end



  }
}
////////////////////设置COOKIE
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
</script>

<style lang="scss" scoped>
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 120px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #1D8CE0;
    .title {
        margin: 0 auto 40px;
        text-align: center;
        color: #505458;
    }
    .title_sysinfo {
        margin: 0 auto 40px;
        text-align: center;
        color: #20A0FF;
    }
    .remember {
        margin: 0 0 35px;
    }
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

}
</style>
