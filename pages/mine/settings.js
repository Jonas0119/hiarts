const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    version: '1.0.0',
    languages: [
      { code: 'zh-Hant', name: '繁體中文' },
      { code: 'en', name: 'English' }
    ],
    languageIndex: 0,
    notification: true,
    cacheSize: '0MB',
    t: t
  },

  onLoad: function() {
    this.initLanguage()
    this.initNotification()
    this.calculateCacheSize()
  },

  initLanguage: function() {
    const currentLang = wx.getStorageSync('language') || 'zh-Hant'
    const index = this.data.languages.findIndex(lang => lang.code === currentLang)
    this.setData({
      languageIndex: index >= 0 ? index : 0
    })
  },

  initNotification: function() {
    const notification = wx.getStorageSync('notification')
    this.setData({
      notification: notification !== false
    })
  },

  calculateCacheSize: function() {
    const size = wx.getStorageInfoSync().currentSize
    this.setData({
      cacheSize: (size / 1024).toFixed(2) + 'MB'
    })
  },

  changeLanguage: function(e) {
    const index = e.detail.value
    const lang = this.data.languages[index]
    
    wx.setStorageSync('language', lang.code)
    this.setData({ languageIndex: index })
    
    wx.showModal({
      title: t('settings.languageChanged'),
      content: t('settings.restartApp'),
      showCancel: false,
      success: () => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    })
  },

  toggleNotification: function(e) {
    const notification = e.detail.value
    wx.setStorageSync('notification', notification)
    this.setData({ notification })
  },

  clearCache: function() {
    wx.showModal({
      title: t('settings.clearCacheTitle'),
      content: t('settings.clearCacheConfirm'),
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          this.calculateCacheSize()
          wx.showToast({
            title: t('settings.cleared')
          })
        }
      }
    })
  },

  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()
    
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        wx.showModal({
          title: t('settings.updateAvailable'),
          content: t('settings.updateConfirm'),
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      } else {
        wx.showToast({
          title: t('settings.noUpdate'),
          icon: 'none'
        })
      }
    })
  },

  goToPrivacy: function() {
    wx.navigateTo({
      url: '/pages/webview/index?type=privacy'
    })
  },

  goToTerms: function() {
    wx.navigateTo({
      url: '/pages/webview/index?type=terms'
    })
  },

  logout: function() {
    wx.showModal({
      title: t('settings.logoutTitle'),
      content: t('settings.logoutConfirm'),
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '/pages/login/index'
          })
        }
      }
    })
  }
}) 