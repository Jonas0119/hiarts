const app = getApp()
import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    amount: 0,
    t: t
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!app.checkLogin()) {
      return
    }
    if (options.amount) {
      this.setData({
        amount: options.amount
      })
    }
  },

  goBack: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
}) 