const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    id: '',
    orderDetail: {},
    t: t
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.loadOrderDetail()
    }
  },

  loadOrderDetail: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/order/detail',
      method: 'GET',
      data: { id: this.data.id },
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            orderDetail: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  confirmReceive: function() {
    wx.showModal({
      title: t('common.tips'),
      content: t('mine.confirmReceive'),
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/tjfae-space/order/confirm',
            method: 'POST',
            data: { id: this.data.id },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${wx.getStorageSync('token')}`
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: t('common.success')
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
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

  getStatusText: function(state) {
    const statusMap = {
      'unpaid': t('mine.orderStatus.unpaid'),
      'unshipped': t('mine.orderStatus.unshipped'),
      'shipped': t('mine.orderStatus.shipped'),
      'completed': t('mine.orderStatus.completed')
    }
    return statusMap[state] || ''
  },

  getStatusDesc: function(state) {
    const descMap = {
      'unpaid': t('mine.orderDesc.unpaid'),
      'unshipped': t('mine.orderDesc.unshipped'),
      'shipped': t('mine.orderDesc.shipped'),
      'completed': t('mine.orderDesc.completed')
    }
    return descMap[state] || ''
  }
}) 