import { t } from '../../utils/i18n'

Page({
  data: {
    amount: 0,
    t: t
  },

  onLoad: function(options) {
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