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
            <mu-flexbox-item class="captcha-image">
              <img id="captcha-image" src="">
            </mu-flexbox-item>
          </mu-flexbox>
        </div>
      </div>
      <div class="login-act">
        <mu-raised-button label="登陆"
                          v-if="loginInfo._xsrf"
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
      loginInfo: {
        cookie: '',
        _xsrf: null,
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
      this.$api.login(this.loginInfo).then(rs => {
        window.console.log(rs)
      }).catch(err => {
        window.console.log(err)
        if (err.response) {
          window.alert(err.response.data.msg)
        }
      })
    },
    refreshCaptcha () {
      const time = Date.now()
      const src = `https://www.zhihu.com/captcha.gif?r=${time}&type=login`
      document.querySelector('#captcha-image').src = src
      document.querySelector('#captcha-image').onload = (rs) => {
        window.console.log(rs)
      }
    },
    getCaptcha () {
      this.$api.getCaptcha(this.loginInfo.cooki).then(rs => {
        window.console.log(rs)
      }).catch(err => {
        window.console.log(err)
        if (err.response) {
          window.alert(err.response.data.msg)
        }
      })
    },
    buildInfo (rs) {
      // this.refreshCaptcha()
      this.loginInfo._xsrf = rs.data.xsrf
      if (rs.headers['set-cookie']) {
        this.loginInfo.cookie = rs.headers['set-cookie'].join('')
      }
      // this.getCaptcha()
    },
    initLogin () {
      this.$api.initLogin().then(rs => {
        window.console.log(rs)
        this.buildInfo(rs.data)
      }).catch(err => {
        window.console.log(err)
        if (err.response) {
          window.alert(err.response.data.msg)
        }
      })
    }
  }
}
</script>

<style>
.login-page {
  position: absolute;
  z-index: 1;
  background-color: #fff;
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
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  text-align: center;
}
.login-box .title {
  margin-bottom: 10px;
}
.login-act {
  margin-top: 20px;
}
</style>
