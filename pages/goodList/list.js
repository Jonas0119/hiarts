import { t } from '../../utils/i18n'

Page({
  data: {
    goodsList: [],
    categories: [],
    currentCategory: 'all',
    pageNum: 1,
    pageSize: 10,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.getCategories()
    this.getGoodsList()
  },

  // 获取商品分类
  getCategories() {
    wx.request({
      url: 'http://gw.antan-tech.com/api/goods/categories',
      success: (res) => {
        if(res.data.code === 200) {
          this.setData({
            categories: res.data.data
          })
        }
      }
    })
  },

  // 获取商品列表
  getGoodsList() {
    if(this.data.loading || !this.data.hasMore) return
    
    this.setData({ loading: true })
    
    wx.request({
      url: 'http://gw.antan-tech.com/api/goods/list',
      data: {
        category: this.data.currentCategory,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if(res.data.code === 200) {
          const newList = [...this.data.goodsList, ...res.data.data.list]
          this.setData({
            goodsList: newList,
            hasMore: res.data.data.hasMore
          })
        }
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  // 切换分类
  changeCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentCategory: category,
      goodsList: [],
      pageNum: 1,
      hasMore: true
    }, () => {
      this.getGoodsList()
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      pageNum: 1,
      hasMore: true
    }, () => {
      this.getGoodsList()
      wx.stopPullDownRefresh()
    })
  },

  // 上拉加载更多
  onReachBottom() {
    if(this.data.hasMore) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.getGoodsList()
      })
    }
  },

  // 跳转到商品详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goodDetail/detail?id=${id}`
    })
  }
}) 