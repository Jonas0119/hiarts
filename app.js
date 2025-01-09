const { updateNavigationBarTitle, t } = require('./utils/i18n');

App({
  globalData: {
    baseUrl: 'http://gw.antan-tech.com/api',
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
    this.globalData.locale = locale
    wx.setStorageSync('locale', locale)
    // 更新导航栏标题
    updateNavigationBarTitle()
    // 更新tabBar文本
    this.updateTabBarText(locale)
    // 通知所有监听者
    this.globalData.watchLocale.forEach(callback => {
      callback(locale)
    })
  },

  // 更新tabBar文本
  updateTabBarText: function(locale) {
    wx.setTabBarItem({
      index: 0,
      text: t('tabBar.home', locale)
    })
    wx.setTabBarItem({
      index: 1,
      text: t('tabBar.goods', locale)
    })
    wx.setTabBarItem({
      index: 2,
      text: t('tabBar.mine', locale)
    })
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
      wx.redirectTo({
        url: '/pages/login/index'
      })
      return false
    }
    return true
  },

  checkLogin2: function () {
    const token = wx.getStorageSync('token')

    const pages = getCurrentPages()
    let currentPageUrl = ''
    pages.forEach((page, index) => {
      console.log(`checkLogin Page ${index + 1}: ${page.route}`);
    });
    if (pages.length > 0) {
      var currentPage = pages[pages.length - 1]
      currentPageUrl = currentPage.route
    } 

    if (!token) {
      wx.showToast({
        title: t('common.tipLogin', this.globalData.locale),
        icon: 'none'
      })

      console.log("the currentPageUrl is:" + currentPageUrl)
      wx.redirectTo({
        url: '/pages/login/index?redirect='
          + encodeURIComponent(currentPageUrl)
      })
      return false
    }
    return true
  }
})
