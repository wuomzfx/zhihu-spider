<template>
  <div class="login-page">
    <mu-paper class="login-box" :zDepth="1">
      <div class="title">知乎帐号</div>
      <div class="form">
        <mu-text-field hintText="手机号" v-model="loginInfo.phone_num" fullWidth/>
        <mu-text-field hintText="密码" v-model="loginInfo.password" type="password" fullWidth/>
        <div class="captcha">
          <mu-flexbox>
            <mu-flexbox-item>
              <mu-text-field hintText="验证码" v-model="loginInfo.captcha" fullWidth/>
            </mu-flexbox-item>
            <mu-flexbox-item class="captcha-image" @click.native=refreshCaptcha>
              <img id="captcha-image" src="">
            </mu-flexbox-item>
          </mu-flexbox>
        </div>
      </div>
      <div class="login-act">
        <mu-raised-button label="登录"
                          fullWidth
                          backgroundColor="#2196f3"
                          @click="login"/>
      </div>
    </mu-paper>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginToken: false,
      loginInfo: {
        _xsrf: '',
        phone_num: '',
        password: '',
        captcha: ''
      }
    }
  },
  mounted () {
    this.initLogin()
  },
  methods: {
    login () {
      if (this.loginToken) return
      this.loginToken = true
      this.$api.login(this.loginInfo).then(rs => {
        this.loginToken = false
        if (rs.data.success && rs.data.auth) {
          this.$api.setAnserAuth(rs.data.auth)
          // window.alert(rs.data.auth._id)
          this.$router.push('/')
        }
      }).catch(() => {
        this.loginToken = false
      })
    },
    refreshCaptcha () {
      document.querySelector('#captcha-image').src = this.$api.getCaptcha()
    },
    buildInfo (rs) {
      // this.loginInfo._xsrf = rs.data.xsrf
      this.refreshCaptcha()
    },
    initLogin () {
      this.$api.initLogin().then(rs => {
        window.console.log(rs)
        this.buildInfo(rs.data)
      })
    }
  }
}
</script>

<style>
.login-page {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5;
}
.mu-flexbox .mu-flexbox-item.captcha-image {
  height: 48px;
  width: 120px;
  max-width: 120px;
  position: relative;
  top: -10px;
}
.captcha-image img{
  width: 100%;
  height: 100%;
}
.login-box {
  display: block;
  padding: 30px;
  min-height: 100px;
  width: 80%;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.login-box .title {
  margin-bottom: 10px;
}
.login-act {
  margin-top: 20px;
}
</style>
