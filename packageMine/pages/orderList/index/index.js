const app = getApp()
import { t } from '../../../../utils/i18n'
const pageBehavior = require('../../../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    list: [],
    token: '',
    dataLoaded: false
  },

  onLoad: function() {
    // 初始化时设置 token 和语言
    const token = wx.getStorageSync('token') || ''
    this.setData({
      token: token
    })
    
    if (token) {
      this.init()
    } else {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const currentPageUrl = currentPage.route
      wx.redirectTo({
        url: '/pages/login/index?redirect=' + encodeURIComponent(currentPageUrl)
      })
    }
  },

  onShow: function() {
    //确保每次进入页面的时候都是最新的token，因为token可能是因为被踢掉
    //但是咱们用的是naigate back返回，所以需要重新设置token
    const token = wx.getStorageSync('token') || ''
    if (this.data.token !== token) {
      this.setData({
        token: token
      })
      if (token) {
        this.init()
      }
    }
  },

  onPullDownRefresh: function() {
    console.log("orderList Language changed, token:", wx.getStorageSync('token'))
    this.init()
  },

  // 语言变化时重新加载数据
  onLocaleChange: function() {
    this.init()
  },

  pickup: function(e) {
    const id = e.currentTarget.dataset.id
    console.log("In orderlist Page this.data.token:" + this.data.token)
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/order/pickup/receive',
      method: 'POST',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.data.token
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.init()
        } else if (res.data.code == '999999') {
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const currentPageUrl = currentPage.route

          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          console.log("the currentPageUrl is:" + currentPageUrl)
          wx.redirectTo({
            url: '/pages/login/index?redirect='
              + encodeURIComponent(currentPageUrl)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  formateState: function(state) {
    if (state === 'paying') {
      return t('order.unPay', this.data.locale)
    } else if (state === 'finishPay') {
      return t('order.unget', this.data.locale)
    } else if (state === 'waitSend') {
      return t('order.unsend', this.data.locale)
    } else if (state === 'finishSend') {
      return t('order.sended', this.data.locale)
    } else if (state === 'finishOrder') {
      return t('order.done', this.data.locale)
    }
  },

  init: function() {
    this.setData({ dataLoaded: false })
    console.log("In orderlist Page this.data.locale:" + this.data.locale)
    console.log("In orderlist Page this.data.token:" + this.data.token)
    wx.showLoading({
      title: t('common.loading', this.data.locale),
      mask: true
    })
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/myOrder',
      method: 'POST',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.data.token
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        console.log("In orderlist Page res.data.code:" + res.data.code)
        if (res.data.code == 200) {
          const orderList = res.data.data.list.map(item => ({
            ...item,
            targetImage: this.getImage(item.targetImage),
            targetImageEnglish: this.getImage(item.targetImageEnglish),
          }))
          this.setData({
            list: orderList,
            dataLoaded: true
          })
        } else if (res.data.code == '999999') {
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const currentPageUrl = currentPage.route

          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          console.log("the currentPageUrl is:" + currentPageUrl)
          wx.redirectTo({
            url: '/pages/login/index?redirect='
              + encodeURIComponent(currentPageUrl)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.setData({ dataLoaded: true })
        }
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  // 处理商品图片
  getImage(sourceImages) {
    if (!sourceImages) return ''

    const array = sourceImages.split(',')
    return array[0]
  },

  goDetailPage: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packageMine/pages/orderDetail/index/index?id=' + id
    })
  },

  requestDelivery: function(e) {
    const id = e.currentTarget.dataset.id
    console.log('the order id is:', id);
    wx.redirectTo({
      url: '/packageMine/pages/orderDetail/index/index?id=' + id
    })
  },

  payOrder: function(e) {
    const id = e.currentTarget.dataset.id
    console.log('the order id is:', id);
    wx.navigateTo({
      url: '/packageMine/pages/orderDetail/index/index?id=' + id
    })
  }
}) 