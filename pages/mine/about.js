import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    pages: [
      {
        name: t('mine.tradeRule'),
        enable: false
      },
      {
        name: t('mine.chargeRule'),
        enable: false
      },
      {
        name: t('mine.memberRule'),
        enable: false,
        url: 'pages/mine/addressList'
      },
      {
        name: t('mine.privaceRule'),
        enable: true,
        url: 'pages/mine/privacy'
      },
      {
        name: t('mine.userAgreement'),
        enable: true,
        url: 'pages/mine/user'
      }
    ],
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  onShow: function() {
    // 在页面显示时检查语言是否变化并更新页面数据
    const currentLocale = wx.getStorageSync('locale') || 'zh-Hant'
    if (currentLocale !== this.data.locale) {
      this.setData({
        locale: currentLocale,
        pages: [
          {
            name: t('mine.tradeRule'),
            enable: false
          },
          {
            name: t('mine.chargeRule'),
            enable: false
          },
          {
            name: t('mine.memberRule'),
            enable: false,
            url: 'pages/mine/addressList'
          },
          {
            name: t('mine.privaceRule'),
            enable: true,
            url: 'pages/mine/privacy'
          },
          {
            name: t('mine.userAgreement'),
            enable: true,
            url: 'pages/mine/user'
          }
        ]
      })
    }
  },

  goDetailPage: function(e) {
    const { url, enable } = e.currentTarget.dataset
    console.log('点击页面, url:', url, 'enable:', enable)
    
    if (!enable) {
      wx.showToast({
        title: t('common.soon'),
        icon: 'none'
      })
      return
    }
    
    if (url) {
      console.log('准备跳转到:', url)
      wx.navigateTo({
        url: '/' + url,
        success: function() {
          console.log('跳转成功')
        },
        fail: function(err) {
          console.error('跳转失败:', err)
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    }
  }
}) 