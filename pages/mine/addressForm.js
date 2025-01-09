const app = getApp()
import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    formData: {
      defaultAddressFlag: 'Y'
    },
    switched: true,
    type: '',
    id: '',
    token: '',
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  onLoad: function (option) {
    this.setData({
      type: option.type
    })

    if (!app.checkLogin()) return

    let token = wx.getStorageSync('token')
    if (token) {
      this.setData({ token: token })
      if (this.data.type == 'edit') {
        this.setData({ id: option.id })
        this.getInfo()
      }
    }
  },

  onShow: function() {
    // 在页面显示时检查语言是否变化
    const currentLocale = wx.getStorageSync('locale') || 'zh-Hant'
    if (currentLocale !== this.data.locale) {
      this.setData({
        locale: currentLocale
      })
    }
  },

  getInfo: function() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/' + this.data.id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.data.token
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            formData: res.data.data,
            switched: res.data.data.defaultAddressFlag == 'Y'
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

  onChange: function(e) {
    this.setData({
      switched: e.detail.value
    })
  },

  onInput: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      ['formData.' + field]: value
    })
  },

  saveAddress: function() {
    if (!app.checkLogin()) return

    this.setData({
      'formData.defaultAddressFlag': this.data.switched ? 'Y' : 'N'
    })

    if (!this.data.formData.receiveName) {
      wx.showToast({
        title: t('common.tipName'),
        icon: 'none'
      })
      return
    } else if (!this.data.formData.receiveMobile) {
      wx.showToast({
        title: t('common.tipPhone'),
        icon: 'none'
      })
      return
    } else if (!this.data.formData.address) {
      wx.showToast({
        title: t('common.tipAdd'),
        icon: 'none'
      })
      return
    }

    const url = this.data.type == 'add' 
      ? app.globalData.baseUrl + '/tjfae-space/goodsAddress/add'
      : app.globalData.baseUrl + '/tjfae-space/goodsAddress/edit'
    const method = this.data.type == 'add' ? 'POST' : 'PUT'

    wx.request({
      url: url,
      method: method,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.data.token
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: t('common.success'),
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({ delta: 1 })
          }, 2000)
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

  onDel: function() {
    if (!app.checkLogin()) return

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/' + this.data.id,
      method: 'DELETE',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.data.token
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: t('common.delsuccess'),
            icon: 'none'
          })
          wx.navigateBack({ delta: 1 })
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
  }
}) 