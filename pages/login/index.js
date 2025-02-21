import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')
const app = getApp()

Page({
  behaviors: [pageBehavior],
  data: {
    phone: '',
    code: '',
    agreed: false,
    loading: false,
    counting: false,
    timer: null,
    countdown: 120,
    inviterPhone: '',
    subjectCode: '78f107a3ea754d78a6721352771aeabc', // 正式环境
    t: t,
    locale: 'zh-Hant',
    sendCodeText: '',
    redirect: ''
  },

  onLoad: function(options) {
    this.setData({ 
      sendCodeText: t('common.getCode', this.data.locale)
    })
    
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
        serviceProvidersCode: 'aliyun',
        smsPhone: phone,
        smsType: 'login',
        subjectCode: '64ab0a94b1e248d88ee25e1f63f75217'
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
      sendCodeText: t('common.reGet', this.data.locale) + '(120s)'
    })

    const timer = setInterval(() => {
      let countdown = this.data.countdown - 1
      if (countdown <= 0) {
        clearInterval(timer)
        this.setData({
          counting: false,
          timer: null,
          sendCodeText: t('common.getCode',this.data.locale)
        })
      } else {
        this.setData({
          countdown: countdown,
          sendCodeText: t('common.reGet', this.data.locale) + `(${countdown}s)`
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
      serviceProvidersCode: 'aliyun',
      subject: 'hjs',
      subjectCode: '64ab0a94b1e248d88ee25e1f63f75217',
      nscType: 2
    }

    if (this.data.inviterPhone) {
      params.inviterPhone = this.data.inviterPhone
    }

    const url = this.data.inviterPhone ? 
      'https://gw.antan-tech.com/paasapi/usercenter/userApp/center/inviterRegister' :
      app.globalData.baseUrl + '/usercenter/userApp/center/login'

    wx.request({
      url: url,
      method: 'POST',
      data: params,
      header: {
        'content-type': this.data.inviterPhone ? 'application/json' : 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code === '00000000') {
          const content = res.data.content
          wx.setStorageSync('accountId', content.account)
          wx.setStorageSync('phone', phone)
          wx.setStorageSync('headImg', content.headImg)
          wx.setStorageSync('name', content.name)
          wx.setStorageSync('token', content.userToken)
          setTimeout(() => {
            const pages = getCurrentPages()
            if (pages.length > 1) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          }, 1000)
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

  isInTabBarList: function (url) {
    const tabBarList = [
      "pages/index/index",
      "pages/goods/list",
      "pages/mine/index"
    ];
    return tabBarList.includes(url);
  },

  goToPrivacy: function () {
    wx.navigateTo({
      url: '/pages/agreement/privacy'
    })
  },

  // 语言变化时更新文本
  onLocaleChange: function() {
    this.setData({
      sendCodeText: this.data.counting ? 
        t('common.reGet', this.data.locale) + `(${this.data.countdown}s)` :
        t('common.getCode', this.data.locale)
    })
  }
}) 