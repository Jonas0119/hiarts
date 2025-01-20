import { t } from '../../../../utils/i18n'
const pageBehavior = require('../../../../utils/pageBehavior')
const app = getApp()

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
        enable: false
      },
      {
        name: t('mine.privaceRule'),
        enable: true,
        url: 'packageMine/pages/privacy/index/index'
      },
      {
        name: t('mine.userAgreement'),
        enable: true,
        url: 'packageMine/pages/user/index/index'
      }
    ],
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  onLoad: function() {
    // 检查token状态
    if (!app.checkLogin()) {
      return
    }

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
            enable: false
          },
          {
            name: t('mine.privaceRule'),
            enable: true,
            url: 'packageMine/pages/privacy/index/index'
          },
          {
            name: t('mine.userAgreement'),
            enable: true,
            url: 'packageMine/pages/user/index/index'
          }
        ]
      })
    }
  },

  goDetailPage: function(e) {
    const { url, enable } = e.currentTarget.dataset
    if (!enable) {
      wx.showToast({
        title: t('common.soon'),
        icon: 'none'
      })
      return
    }

    if (url) {
      console.log('url', url)
      wx.navigateTo({
        url: '/' + url
      })
    }
  }
}) 