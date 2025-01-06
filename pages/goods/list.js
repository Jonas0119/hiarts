import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

const app = getApp()

Page({
  behaviors: [pageBehavior],
  data: {
    locale: 'zh-Hant',
    t: t,
    sift_items: ['全部', '未开始', '进行中', '已结束'],
    currentTab: 0,
    goodsList: [],
    pageNum: 1,
    pageSize: 10,
    state: '',
    hasMore: true
  },

  onLoad: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    console.log("the local is:" + locale)
    console.log("the t is:" + t("goodsList.unbuy"))
    this.setData({ locale })
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

  switchTab: function(e) {
    const index = e.currentTarget.dataset.index
    let state = ''
    
    switch(index) {
      case 0:
        state = ''
        break
      case 1:
        state = 'ready'
        break
      case 2:
        state = 'buying'
        break
      case 3:
        state = 'end'
        break
    }

    this.setData({
      currentTab: index,
      state: state,
      pageNum: 1,
      goodsList: [],
      hasMore: true
    })

    this.loadGoodsList()
  },

  loadGoodsList: function() {
    wx.showLoading({
      title: '加载中...'
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsList',
      method: 'POST',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        state: this.data.state
      },
      success: (res) => {
        if (res.data.code === 200) {
          const goodsList = res.data.data.list.map(item => ({
            ...item,
            targetImage: this.getImage(item)
          }))
          this.setData({
            goodsList,
            hasMore: goodsList.length === this.data.pageSize
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
  },
  // 处理商品图片
  getImage(item) {
    let targetImage = ''
    console.log("the locale is:" + this.data.locale)
    if(this.data.locale === 'zh-Hant') {
      targetImage = item.targetImage
    } else {
      targetImage = item.targetImageEnglish
    }
    if (!targetImage) return ''
    
    const array = targetImage.split(',')
    if(array.length > 0) {
      targetImage = array[0]
    }
    //console.log("targetImage  is:" + targetImage)
    return targetImage
  }
}) 