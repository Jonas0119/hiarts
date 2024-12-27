App({
  onLaunch() {
    // 设置默认语言
    wx.setStorageSync('locale', 'zh-Hant')
  },
  globalData: {
    userInfo: null,
    locale: 'zh-Hant'
  }
})
