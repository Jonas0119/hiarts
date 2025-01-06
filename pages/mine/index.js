const app = getApp()
import { t } from '../../utils/i18n'
import uQRCode from '../../utils/uqrcode.js'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    headImg: '',
    phone: '',
    nickname: '',
    locale: 'zh-Hant',
    shareUrl: 'http://218.244.138.12:8086/webHJL/#/pages/login/index?phone=',
    menuList: [
      {
        name: t('mine.myOrder'),
        url: '/pages/mine/orderList',
        icon: '/static/images/order.png'
      },
      {
        name: t('mine.myInvite'),
        url: '/pages/mine/mineInvite',
        icon: '/static/images/myInvite.png'
      },
      {
        name: t('mine.addressMGMT'),
        url: '/pages/mine/addressList',
        icon: '/static/images/address.png'
      },
      {
        name: t('mine.about'),
        url: '/pages/mine/about',
        icon: '/static/images/about.png'
      }
    ]
  },

  onLoad: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })

    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.reLaunch({ url: '/pages/login/index' })
      return
    }

    // 获取用户信息
    this.setData({
      headImg: wx.getStorageSync('headImg') || '',
      phone: wx.getStorageSync('phone') || '',
      nickname: wx.getStorageSync('name') || ''
    }, () => {
      this.generateQRCode()
    })

    // 监听语言变化
    this.localeChangeCallback = (newLocale) => {
      this.setData({
        locale: newLocale,
        menuList: [
          {
            name: t('mine.myOrder'),
            url: '/pages/mine/orderList',
            icon: '/static/images/order.png'
          },
          {
            name: t('mine.myInvite'),
            url: '/pages/mine/mineInvite',
            icon: '/static/images/myInvite.png'
          },
          {
            name: t('mine.addressMGMT'),
            url: '/pages/mine/addressList',
            icon: '/static/images/address.png'
          },
          {
            name: t('mine.about'),
            url: '/pages/mine/about',
            icon: '/static/images/about.png'
          }
        ]
      })
    }
    app.watchLocale(this.localeChangeCallback)
  },

  onShow: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    if (locale !== this.data.locale) {
      this.setData({
        locale,
        menuList: [
          {
            name: t('mine.myOrder'),
            url: '/pages/mine/orderList',
            icon: '/static/images/order.png'
          },
          {
            name: t('mine.myInvite'),
            url: '/pages/mine/mineInvite',
            icon: '/static/images/myInvite.png'
          },
          {
            name: t('mine.addressMGMT'),
            url: '/pages/mine/addressList',
            icon: '/static/images/address.png'
          },
          {
            name: t('mine.about'),
            url: '/pages/mine/about',
            icon: '/static/images/about.png'
          }
        ]
      })
    }
  },

  onUnload: function() {
    if (this.localeChangeCallback) {
      app.unwatchLocale(this.localeChangeCallback)
    }
  },

  generateQRCode: function() {
    uQRCode.make({
      canvasId: 'qrcode',
      componentInstance: this,
      text: this.data.shareUrl + this.data.phone,
      size: 100,
      margin: 0,
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      fileType: 'jpg',
      errorCorrectLevel: uQRCode.errorCorrectLevel.H,
      success: () => {}
    })
  },

  goSetting: function() {
    wx.navigateTo({ url: '/pages/mine/settings' })
  },

  goToInvite: function() {
    wx.navigateTo({ url: '/pages/mine/mineInvite' })
  },

  goDetailPage: function(e) {
    const { url, enable } = e.currentTarget.dataset
    console.log('enable is:', enable)
    console.log('url is:', url)
    if (enable === false) {
      wx.showToast({
        title: t('common.soon'),
        icon: 'none'
      })
      return
    }
    wx.navigateTo({ url })
  }
}) 