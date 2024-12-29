const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    tabs: [
      t('mine.orderStatus.all'),
      t('mine.orderStatus.unpaid'),
      t('mine.orderStatus.unshipped'),
      t('mine.orderStatus.shipped'),
      t('mine.orderStatus.completed')
    ],
    currentTab: 0,
    orderList: [],
    pageNum: 1,
    pageSize: 10,
    hasMore: true,
    t: t
  },

  onLoad: function(options) {
    if (options.status) {
      const statusMap = {
        'unpaid': 1,
        'unshipped': 2,
        'shipped': 3,
        'completed': 4
      }
      this.setData({
        currentTab: statusMap[options.status] || 0
      })
    }
    this.loadOrderList()
  },

  onPullDownRefresh: function() {
    this.setData({
      pageNum: 1,
      orderList: [],
      hasMore: true
    })
    this.loadOrderList()
  },

  onReachBottom: function() {
    if (this.data.hasMore) {
      this.loadMoreOrders()
    }
  },

  switchTab: function(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTab: index,
      pageNum: 1,
      orderList: [],
      hasMore: true
    })
    this.loadOrderList()
  },

  loadOrderList: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    const stateMap = ['', 'unpaid', 'unshipped', 'shipped', 'completed']
    
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/myOrder',
      method: 'POST',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        state: stateMap[this.data.currentTab]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          const list = res.data.data.list
          this.setData({
            orderList: [...this.data.orderList, ...list],
            hasMore: list.length === this.data.pageSize
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
        wx.stopPullDownRefresh()
      }
    })
  },

  loadMoreOrders: function() {
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.loadOrderList()
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/mine/orderDetail?id=${id}`
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
              'Authorization': `Bearer ${wx.getStorageSync('token')}`
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: t('common.success')
                })
                this.setData({
                  pageNum: 1,
                  orderList: [],
                  hasMore: true
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

  getStatusText: function(state) {
    const statusMap = {
      'unpaid': t('mine.orderStatus.unpaid'),
      'unshipped': t('mine.orderStatus.unshipped'),
      'shipped': t('mine.orderStatus.shipped'),
      'completed': t('mine.orderStatus.completed')
    }
    return statusMap[state] || ''
  }
}) 