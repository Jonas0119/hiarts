import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

const app = getApp()

Page({
  behaviors: [pageBehavior],
  data: {
    locale: 'zh-Hant',
    t: t,
    sift_items: [],
    currentTab: 0,
    goodsList: [],
    pageNum: 1,
    pageSize: 10,
    state: '',
    hasMore: true
  },

  onLoad: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ 
      locale,
      sift_items: [
        t('index.all', locale),
        t('goodsList.unbuy', locale),
        t('goodsList.buying', locale),
        t('goodsList.stopbuy', locale)
      ]
    })
    this.loadGoodsList()

    // 监听语言变化
    this.localeChangeCallback = (newLocale) => {
      this.setData({
        locale: newLocale,
        sift_items: [
          t('index.all', newLocale),
          t('goodsList.unbuy', newLocale),
          t('goodsList.buying', newLocale),
          t('goodsList.stopbuy', newLocale)
        ]
      })
    }
    app.watchLocale(this.localeChangeCallback)
  },

  onUnload: function() {
    if (this.localeChangeCallback) {
      app.unwatchLocale(this.localeChangeCallback)
    }
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
      header: { 'content-type': "application/x-www-form-urlencoded" },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          const newGoodsList = res.data.data.list.map(item => ({
            ...item,
            targetImage: this.getImage(item)
          }))
          
          // 如果是第一页，直接设置数据
          if (this.data.pageNum === 1) {
            this.setData({
              goodsList: newGoodsList,
              hasMore: newGoodsList.length === this.data.pageSize
            })
          } else {
            // 如果不是第一页，追加数据
            this.setData({
              goodsList: [...this.data.goodsList, ...newGoodsList],
              hasMore: newGoodsList.length === this.data.pageSize
            })
          }
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