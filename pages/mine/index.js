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
        url: '/packageMine/pages/orderList/index/index',
        icon: '/static/images/order.png'
      },
      {
        name: t('mine.myInvite'),
        url: '/packageMine/pages/mineInvite/index/index',
        icon: '/static/images/myInvite.png'
      },
      {
        name: t('mine.addressMGMT'),
        url: '/packageMine/pages/addressList/index/index',
        icon: '/static/images/address.png'
      },
      {
        name: t('mine.about'),
        url: '/packageMine/pages/about/index/index',
        icon: '/static/images/about.png'
      }
    ]
  },

  onLoad: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })

    // 检查登录状态
    if (!app.checkLogin()) {
      return
    }

    // 获取用户信息
    this.setUserInfo()

    // 监听语言变化
    this.localeChangeCallback = (newLocale) => {
      this.setData({
        locale: newLocale,
        menuList: [
          {
            name: t('mine.myOrder', newLocale),
            url: '/packageMine/pages/orderList/index/index',
            icon: '/static/images/order.png'
          },
          {
            name: t('mine.myInvite', newLocale),
            url: '/packageMine/pages/mineInvite/index/index',
            icon: '/static/images/myInvite.png'
          },
          {
            name: t('mine.addressMGMT', newLocale),
            url: '/packageMine/pages/addressList/index/index',
            icon: '/static/images/address.png'
          },
          {
            name: t('mine.about', newLocale),
            url: '/packageMine/pages/about/index/index',
            icon: '/static/images/about.png'
          }
        ]
      })
    }
    app.watchLocale(this.localeChangeCallback)
  },

  onShow: function() {
    // 检查语言变化
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    if (locale !== this.data.locale) {
      this.setData({
        locale,
        menuList: [
          {
            name: t('mine.myOrder', locale),
            url: '/packageMine/pages/orderList/index/index',
            icon: '/static/images/order.png'
          },
          {
            name: t('mine.myInvite', locale),
            url: '/packageMine/pages/mineInvite/index/index',
            icon: '/static/images/myInvite.png'
          },
          {
            name: t('mine.addressMGMT', locale),
            url: '/packageMine/pages/addressList/index/index',
            icon: '/static/images/address.png'
          },
          {
            name: t('mine.about', locale),
            url: '/packageMine/pages/about/index/index',
            icon: '/static/images/about.png'
          }
        ]
      })
    }

    // 更新用户信息
    this.setUserInfo()
  },

  onUnload: function() {
    if (this.localeChangeCallback) {
      app.unwatchLocale(this.localeChangeCallback)
    }
  },

  setUserInfo: function() {
    this.setData({
      headImg: wx.getStorageSync('headImg') || '',
      phone: wx.getStorageSync('phone') || '',
      nickname: wx.getStorageSync('name') || ''
    }, () => {
      this.generateQRCode()
    })
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
    wx.navigateTo({ url: '/packageMine/pages/settings/index/index' })
  },

  goToInvite: function() {
    wx.navigateTo({ url: '/packageMine/pages/mineInvite/index/index' })
  },

  goDetailPage: function(e) {
    const { url, enable } = e.currentTarget.dataset
    if (enable === false) {
      wx.showToast({
        title: t('common.soon', this.data.locale),
        icon: 'none'
      })
      return
    }
    wx.navigateTo({ url })
  }
}) 