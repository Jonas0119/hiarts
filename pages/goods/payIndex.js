import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

const app = getApp()

Page({
  behaviors: [pageBehavior],
  data: {
    locale: 'zh-Hant',
    t: t,
    payUrl: ''
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!app.checkLogin()) {
      return
    }
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })
    
    if (options.payUrl) {
      this.setData({
        payUrl: decodeURIComponent(options.payUrl)
      })
    }
  },

  onWebViewLoad: function() {
    console.log('WebView loaded')
  },

  handleMessage: function(e) {
    console.log('WebView message:', e.detail)
  }
}) 