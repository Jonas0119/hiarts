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
    t: t,
    locale: 'zh-Hant',
    sift_items: [],
    currentTab: 0,
    state: '',
    targetType: ''
  },

  onLoad: function(options) {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ 
      locale,
      targetType: options.targetType || '',
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
      title: t('common.loading', this.data.locale)
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsList',
      method: 'POST',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        state: this.data.state,
        typeId: this.data.targetType
      },
      header: {'content-type': "application/x-www-form-urlencoded"},
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.data.code === 200) {
          const list = res.data.data.list.map(item => ({
            ...item,
            targetImage: this.getImage(item)
          }))
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
    return targetImage
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goods/detail?id=${id}`
    })
  }
}) 