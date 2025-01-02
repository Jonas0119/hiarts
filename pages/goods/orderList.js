const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    list: [],
    locale: 'zh-Hant'
  },

  onLoad: function() {
    this.setData({
      locale: wx.getStorageSync('locale') || 'zh-Hant'
    })
    this.loadOrderList()

    // 监听语言变化
    this.localeChangeCallback = (newLocale) => {
      this.setData({ locale: newLocale })
    }
    app.watchLocale(this.localeChangeCallback)
  },

  onUnload: function() {
    if (this.localeChangeCallback) {
      app.unwatchLocale(this.localeChangeCallback)
    }
  },

  onPullDownRefresh: function() {
    this.loadOrderList()
  },

  loadOrderList: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/order/list',
      method: 'POST',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            list: res.data.data.list
          })
        } else if (res.data.code === '999999') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.removeStorage({ key: 'accountId' })
            wx.removeStorage({ key: 'token' })
            wx.removeStorage({ key: 'phone' })
            wx.removeStorage({ key: 'headImg' })
            wx.removeStorage({ key: 'name' })
            wx.reLaunch({ url: '/pages/login/index' })
          }, 2000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  goDetailPage: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mine/orderDetail?id=' + id
    })
  },

  confirmReceive: function(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: t('common.tips'),
      content: t('mine.confirmReceive'),
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/tjfae-space/order/confirm',
            method: 'POST',
            data: { id },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: t('common.success')
                })
                this.loadOrderList()
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },

  requestDelivery: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mine/orderDetail?id=' + id
    })
  },

  getStatusText: function(state) {
    if (state === 'paying') {
      return t('order.unPay')
    } else if (state === 'finishPay') {
      return t('order.unget')
    } else if (state === 'waitSend') {
      return t('order.unsend')
    } else if (state === 'finishSend') {
      return t('order.sended')
    } else if (state === 'finishOrder') {
      return t('order.done')
    }
    return ''
  }
}) 