App({
  onLaunch() {
    // 设置默认语言
    wx.setStorageSync('locale', 'zh-Hant')
  },
  globalData: {
    userInfo: null,
    locale: 'zh-Hant',
    baseUrl: 'https://gw.antan-tech.com/api'
  },
  
  // 检查登录状态
  checkLogin(redirectUrl) {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: `/pages/login/index?redirect=${encodeURIComponent(redirectUrl || getCurrentPages()[getCurrentPages().length - 1].route)}`
      })
      return false
    }
    return true
  },

  // 处理API响应
  handleApiResponse(res, callback) {
    if (res.data.code === 999999) {
      // token过期，清除本地存储并跳转到登录页
      wx.clearStorageSync()
      const currentPage = getCurrentPages()[getCurrentPages().length - 1]
      wx.navigateTo({
        url: `/pages/login/index?redirect=${encodeURIComponent(currentPage.route)}`
      })
      return false
    }
    
    if (callback) {
      callback(res)
    }
    return true
  }
})
