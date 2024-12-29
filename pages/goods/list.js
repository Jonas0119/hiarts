const app = getApp()

Page({
  data: {
    sift_items: ['全部', '未开始', '进行中', '已结束'],
    currentTab: 0,
    goodsList: [],
    pageNum: 1,
    pageSize: 10,
    state: '',
    hasMore: true
  },

  onLoad: function() {
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