<template>
  <div class="register" id="register">
    <div class="login" id="login">
      <a href="javascript:;" class="log-close"><i class="icons close"></i></a>
      <div class="log-bg">
        <div class="log-cloud cloud1"></div>
        <div class="log-cloud cloud2"></div>
        <div class="log-cloud cloud3"></div>
        <div class="log-cloud cloud4"></div>

        <div class="log-logo">欢迎注册!</div>
        <div class="log-text">请和管理员申请验证码，否则无法注册为管理员</div>
      </div>
      <div class="log-email">
        <input type="text" placeholder="用户名" :class="'log-input' + (username==''?' log-input-empty':'')"
               v-model="username">
        <input type="password" placeholder="密码"
               :class="'log-input' + (password==''?' log-input-empty':'')" v-model="password">
        <input type="password" placeholder="确认密码" :class="'log-input' + (confirmPassword==''?' log-input-empty':'')"
               v-model="confirmPassword">
        <input type="text" placeholder="验证码" :class="'log-input'" v-model="validateCode">
        <a href="javascript:;" class="log-btn" @click="register">注册</a>
        <a href="/" class="log-btn register-btn">返回登录</a>
      </div>
      <Loading v-if="isLoging" marginTop="-30%"></Loading>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/LoadingPage.vue";
import {Base64} from "js-base64";
import axios from "axios";
import {login} from "@/api/users";
import {ElMessage} from "element-plus";

export default {
  name: 'UserRegister',
  data() {
    return {
      isLoging: false,
      username: '',
      password: '',
      confirmPassword: '',
      validateCode: ''
    }
  },
  components: {
    Loading
  },
  methods: {
    // 注册逻辑
    register() {
      if (this.username !== '' && this.password !== '' && this.password === this.confirmPassword) {
        this.toRegister();
      } else {
        alert('密码和确认密码必须一致');
      }
    },

    // 注册请求
    async toRegister() {
      let password_sha = Base64.encode(this.password);

      // 需要向后端发送的注册参数
      let registerParam = {
        username: this.username,
        password: password_sha,
        validateCode: this.validateCode
      };

      console.log(registerParam);
      // 设置为登录状态
      this.isLoging = true;

      try {
        // 请求后端注册接口
        const registerResponse = await axios.post('http://localhost:9090/api/users/register', registerParam);
        console.log('用户注册成功:', registerResponse.data);
        if (registerResponse.data.success) {
          await this.autoLogin();
        } else {
          ElMessage({
            message: '注册失败' + registerResponse.data.message,
            type: 'error'
          })
        }
        // 注册成功后自动登录
      } catch (error) {
        ElMessage({
          message: '注册失败: ' + error.response.data,
          type: 'error'
        })
        console.error('注册失败:', error);
        this.isLoging = false;
      }
    },

    // 自动登录请求
    async autoLogin() {
      let password_sha = Base64.encode(this.password);


      // 需要向后端发送的登录参数
      let loginParam = {
        username: this.username,
        password: password_sha
      };

      try {
        const response = await login(loginParam);
        const data = await response.json();

        // 检查 response 是否存在
        if (response && response.ok) {
          console.log('Login successful:', data.user);

          // 假设 token 存在 response.data 中
          const token = data.token; // 具体根据后端返回的数据调整

          // 将 token 存储到 localStorage
          localStorage.setItem('token', token);

          // 登录状态15天后过期，这里不再使用 cookie，直接使用 localStorage
          let expireDays = 1000 * 60 * 60 * 24 * 15;
          this.setCookie('token', token, expireDays);
          this.isLoging = false;

          // 登录成功后
          this.$router.push({path: '/dashboard/'});
        } else {
          throw new Error('Response data is undefined');
        }

      } catch (error) {
        console.error('Login error:', error); // 增加错误日志
        alert('Invalid username or password');
        this.isLoging = false;
      }
    }
  }
};
</script>

<style scoped>
.register {
  position: fixed;
  overflow: hidden;
  left: 50%;
  margin-left: -250px;
  top: 45%;
  margin-top: -350px;
  width: 500px;
  min-height: 555px;
  z-index: 10;
  right: 140px;
  background: #fff;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: 0px 3px 16px -5px #070707;
  box-shadow: 0px 3px 16px -5px #070707
}

.log-close {
  display: block;
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 1;
}

.log-close:hover .icons {
  transform: rotate(180deg);
}

.log-close .icons {
  opacity: 1;
  transition: all .3s
}

.log-cloud {
  background-image: url(../images/login-cloud.png);
  width: 63px;
  height: 40px;
  position: absolute;
  z-index: 1
}

.register .cloud1 {
  top: 21px;
  left: -30px;
  transform: scale(.6);
  animation: cloud1 20s linear infinite;
}

.register .cloud2 {
  top: 87px;
  right: 20px;
  animation: cloud2 19s linear infinite;
}

.register .cloud3 {
  top: 160px;
  left: 5px;
  transform: scale(.8);
  animation: cloud3 21s linear infinite;
}

.register .cloud4 {
  top: 150px;
  left: -40px;
  transform: scale(.4);
  animation: cloud4 19s linear infinite;
}

.log-bg {
  background: url(../images/login-bg.jpg);
  width: 100%;
  height: 312px;
  overflow: hidden;
}

.log-logo {
  height: 80px;
  margin: 120px auto 25px;
  text-align: center;
  color: #1fcab3;
  font-weight: bold;
  font-size: 40px;
}

.log-text {
  color: #57d4c3;
  font-size: 13px;
  text-align: center;
  margin: 0 auto;
}

.log-logo, .log-text {
  z-index: 2
}

.icons {
  background: url(../images/icons.png) no-repeat;
  display: inline-block;
}

.close {
  height: 16px;
  width: 16px;
  background-position: -13px 0;
}

.log-btns {
  padding: 15px 0;
  margin: 0 auto;
}

.log-btn {
  width: 402px;
  display: block;
  text-align: left;
  line-height: 50px;
  margin: 0 auto 15px;
  height: 50px;
  color: #fff;
  font-size: 13px;
  -webkit-border-radius: 5px;
  background-color: #3B5999;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
  border-radius: 5px;
  position: relative;
}

.log-btn.tw {
  background-color: #13B4E9
}

.log-btn.email {
  background-color: #50E3CE
}

.log-btn:hover, .log-btn:focus {
  color: #fff;
  opacity: .8;
}

.log-email {
  text-align: center;
  margin-top: 20px;
}

.log-email .log-btn {
  background-color: #50E3CE;
  text-align: center;
}

.log-input-empty {
  border: 1px solid #f37474 !important;
}

.isloading {
  background: #d6d6d6
}

.log-btn .icons {
  margin-left: 30px;
  vertical-align: middle;
}

.log-btn .text {
  left: 95px;
  line-height: 50px;
  text-align: left;
  position: absolute;
}

.log-input {
  width: 370px;
  overflow: hidden;
  padding: 0 15px;
  font-size: 13px;
  border: 1px solid #EBEBEB;
  margin: 0 auto 15px;
  height: 48px;
  line-height: 48px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
  border-radius: 5px;
}

.log-input.warn {
  border: 1px solid #f88787
}

@-webkit-keyframes cloud1 {
  0% {
    left: 200px
  }
  100% {
    left: -130px;
  }
}

@keyframes cloud1 {
  0% {
    left: 200px
  }
  100% {
    left: -130px;
  }
}

@-webkit-keyframes cloud2 {
  0% {
    left: 500px;
  }
  100% {
    left: -90px;
  }
}

@keyframes cloud2 {
  0% {
    left: 500px;
  }
  100% {
    left: -90px;
  }
}

@-webkit-keyframes cloud3 {
  0% {
    left: 620px;
  }
  100% {
    left: -70px;
  }
}

@keyframes cloud3 {
  0% {
    left: 620px;
  }
  100% {
    left: -70px;
  }
}

@-webkit-keyframes cloud4 {
  0% {
    left: 100px;
  }
  100% {
    left: -70px;
  }
}

@keyframes cloud4 {
  0% {
    left: 100px;
  }
  100% {
    left: -70px;
  }
}

</style>