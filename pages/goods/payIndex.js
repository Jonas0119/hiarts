import { t } from '../../utils/i18n'

Page({
  data: {
    locale: 'zh-Hant',
    t: t,
    payUrl: ''
  },

  onLoad: function(options) {
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