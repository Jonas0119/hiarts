const app = getApp()
import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    list: [],
    token: '',
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  onLoad: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      this.setData({ token: token })
      this.init()
    }
  },

  onShow: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      this.setData({ token: token })
      this.init()
    }
    // 在页面显示时检查语言是否变化
    const currentLocale = wx.getStorageSync('locale') || 'zh-Hant'
    if (currentLocale !== this.data.locale) {
      this.setData({
        locale: currentLocale
      })
    }
  },

  onBackPress: function() {
    wx.switchTab({
      url: '/pages/mine/index'
    })
    return true
  },

  init: function() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.data.token
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            list: res.data.rows
          })
        } else if (res.data.code == '999999') {
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const currentPageUrl = currentPage.route

          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          console.log("the currentPageUrl is:" + currentPageUrl)
          wx.redirectTo({
            url: '/pages/login/index?redirect='
              + encodeURIComponent(currentPageUrl)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  goDetailPage: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mine/addressForm?type=edit&id=' + id
    })
  },

  goNew: function() {
    wx.navigateTo({
      url: '/pages/mine/addressForm?type=add'
    })
  }
}) 