const app = getApp()

Page({
  data: {
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  onShow: function() {
    // 在页面显示时检查语言是否变化并更新页面数据
    const currentLocale = wx.getStorageSync('locale') || 'zh-Hant'
    if (currentLocale !== this.data.locale) {
      this.setData({
        locale: currentLocale
      })
    }
  }
}) 