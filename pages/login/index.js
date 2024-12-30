const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    phone: '',
    code: '',
    sendCodeText: t('common.getCode'),
    agreed: false,
    loading: false,
    counting: false,
    timer: null,
    countdown: 120,
    inviterPhone: '',
    subjectCode: '78f107a3ea754d78a6721352771aeabc', // 正式环境
    t: t,
    locale: 'zh-Hant',
    redirect: ''
  },

  onLoad: function(options) {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })
    
    console.log("options is:"+options)
    console.log("t.login is:"+t('login.login'))
    if (options.invatePhone) {
      this.setData({
        inviterPhone: options.invatePhone
      })
    }
    if (options.redirect) {
      this.setData({
        redirect: decodeURIComponent(options.redirect)
      })
    }
  },

  onUnload: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  onCodeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  onCheckboxChange: function(e) {
    this.setData({
      agreed: e.detail.value.length > 0
    })
  },

  sendCode: function() {
    if (this.data.counting) return

    const phone = this.data.phone
    if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
      wx.showToast({
        title: t('common.tipPhone'),
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/usercenter/user/sms/mobileCodeRequest',
      method: 'POST',
      data: {
        serviceProvidersCode: 'tzhl',
        smsPhone: phone,
        smsType: 'login',
        subjectCode: this.data.subjectCode
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.startCountdown()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  startCountdown: function() {
    this.setData({
      counting: true,
      countdown: 120,
      sendCodeText: t('common.reGet') + '(120s)'
    })

    const timer = setInterval(() => {
      let countdown = this.data.countdown - 1
      if (countdown <= 0) {
        clearInterval(timer)
        this.setData({
          counting: false,
          timer: null,
          sendCodeText: t('common.getCode')
        })
      } else {
        this.setData({
          countdown: countdown,
          sendCodeText: t('common.reGet') + `(${countdown}s)`
        })
      }
    }, 1000)

    this.setData({ timer })
  },

  login: function() {
    if (this.data.loading) return

    const { phone, code, agreed } = this.data

    if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
      wx.showToast({
        title: t('common.tipPhone'),
        icon: 'none'
      })
      return
    }

    if (!code) {
      wx.showToast({
        title: t('common.inputCode'),
        icon: 'none'
      })
      return
    }

    if (!agreed) {
      wx.showToast({
        title: t('common.gou'),
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    const params = {
      loginType: 'fast',
      smsType: 'login',
      code: code,
      phone: phone,
      source: 'app',
      serviceProvidersCode: 'tzhl',
      subject: 'hjs',
      subjectCode: this.data.subjectCode,
      nscType: 2
    }

    if (this.data.inviterPhone) {
      params.inviterPhone = this.data.inviterPhone
    }

    const url = this.data.inviterPhone ? 
      'https://gw.antan-tech.com/paasapi/usercenter/userApp/center/inviterRegister' :
      app.globalData.baseUrl + '/usercenter/userApp/center/login'

    console.log("请求url为:"+url)

    wx.request({
      url: url,
      method: 'POST',
      data: params,
      header: {
        'content-type': this.data.inviterPhone ? 'application/json' : 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log("登录结果为:"+res.data.code)
        if (res.data.code === '00000000') {
          const content = res.data.content
          wx.setStorageSync('accountId', content.account)
          wx.setStorageSync('token', content.userToken)
          wx.setStorageSync('phone', phone)
          wx.setStorageSync('headImg', content.headImg)
          wx.setStorageSync('name', content.name)

          console.log("重定向地址为："+this.data.redirect)
          if (this.data.redirect) {
            wx.redirectTo({
              url: '/' + this.data.redirect
            })
          } else {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          this.setData({ loading: false })
        }
      },
      fail: () => {
        this.setData({ loading: false })
      }
    })
  },

  goToUserAgreement: function() {
    wx.navigateTo({
      url: '/pages/agreement/user'
    })
  },

  goToPrivacy: function() {
    wx.navigateTo({
      url: '/pages/agreement/privacy'
    })
  }
}) 