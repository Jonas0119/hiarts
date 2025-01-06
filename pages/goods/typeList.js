const app = getApp()
import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    goodsList: [],
    pageNum: 1,
    pageSize: 10,
    hasMore: true,
    t: t
  },

  onLoad: function(options) {
    this.loadGoodsList()
  },

  onPullDownRefresh: function() {
    this.setData({
      pageNum: 1,
      goodsList: [],
      hasMore: true
    })
    this.loadGoodsList()
  },

  onReachBottom: function() {
    if (this.data.hasMore) {
      this.loadMoreGoods()
    }
  },

  loadGoodsList: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsList',
      method: 'POST',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        typeId: this.data.typeId
      },
      header:{'content-type' : "application/x-www-form-urlencoded"},
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          const list = res.data.data.list
          this.setData({
            goodsList: [...this.data.goodsList, ...list],
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

  loadMoreGoods: function() {
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.loadGoodsList()
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goods/detail?id=${id}`
    })
  }
}) 