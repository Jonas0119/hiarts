import { t } from '../../../../utils/i18n'
const pageBehavior = require('../../../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    locale: 'zh-Hant'
  },

  onLoad: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'

    this.setData({ locale })
  },

  logout: function () {
    wx.removeStorage({ key: 'accountId' })
    wx.removeStorage({ key: 'token' })
    wx.removeStorage({ key: 'phone' })
    wx.removeStorage({ key: 'headImg' })
    wx.removeStorage({
      key: 'name',
      success: () => {
        wx.reLaunch({
          url: '/pages/login/index'
        })
      }
    })
  }
}) 