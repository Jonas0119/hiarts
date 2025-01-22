const { updateNavigationBarTitle, t } = require('./utils/i18n');

App({
  globalData: {
    baseUrl: 'https://gw.antan-tech.com/api',
    userInfo: null,
    token: null,
    locale: 'zh-Hant',
    watchLocale: []
  },

  onLaunch: function() {
    // 获取存储的语言设置
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.globalData.locale = locale
    // 初始更新标题
    updateNavigationBarTitle()
    // 初始更新tabBar
    this.updateTabBarText(locale)
  },

  // 监听语言变化
  watchLocale: function(callback) {
    this.globalData.watchLocale.push(callback)
  },

  // 取消监听语言变化
  unwatchLocale: function(callback) {
    const index = this.globalData.watchLocale.indexOf(callback)
    if (index > -1) {
      this.globalData.watchLocale.splice(index, 1)
    }
  },

  // 设置语言
  setLocale: function(locale) {
    console.log('[Language] Setting new locale:', locale)
    this.globalData.locale = locale
    wx.setStorageSync('locale', locale)
    // 更新导航栏标题
    updateNavigationBarTitle()
    // 更新tabBar文本
    console.log('[Language] Calling updateTabBarText with locale:', locale)
    this.updateTabBarText(locale)
    // 通知所有监听者
    this.globalData.watchLocale.forEach(callback => {
      callback(locale)
    })
  },

  // 更新tabBar文本
  updateTabBarText: function(locale) {
    console.log('[TabBar] Updating text with locale:', locale)
    wx.setTabBarItem({
      index: 0,
      text: t('tabBar.home', locale)
    })
    console.log('[TabBar] Home text:', t('tabBar.home', locale))
    wx.setTabBarItem({
      index: 1,
      text: t('tabBar.goods', locale)
    })
    console.log('[TabBar] Goods text:', t('tabBar.goods', locale))
    wx.setTabBarItem({
      index: 2,
      text: t('tabBar.mine', locale)
    })
    console.log('[TabBar] Mine text:', t('tabBar.mine', locale))
  },

  checkLogin: function () {
    const token = wx.getStorageSync('token')
    console.log("checkLogin token is:" + token)
    if (!token) {
      wx.showToast({
        title: t('common.tipLogin', this.globalData.locale),
        icon: 'none'
      })

      const pages = getCurrentPages()
      pages.forEach((page, index) => {
        console.log(`Login Page ${index + 1}: ${page.route}`);
      });
      wx.navigateTo({
        url: '/pages/login/index'
      })
      return false
    }
    return true
  }
})
