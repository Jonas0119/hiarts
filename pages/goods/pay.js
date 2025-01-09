const app = getApp()
import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    goodsDetail: {},
    goodsImages: '',
    buyNum: 1,
    totalAmount:0,
    locale: 'zh-Hant',
    addressList: [],
    addressIndex: 0,
    showAddressPopup: false
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!app.checkLogin()) {
      return
    } else {
      console.log("has token is:" + wx.getStorageSync('token'))
    }

    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })

    if (options.id && options.number) {
      this.loadGoodsDetail(options.id)
      this.setData({
        buyNum: parseInt(options.number),
      })
    }

    this.loadAddressList()
  },

  onShow: function() {
    this.loadAddressList()
  },

  formatAmount: function(targetAmount, buyedNum) {
    return (Number(targetAmount) * Number(buyedNum)).toFixed(2);
  },

  loadGoodsDetail: function(id) {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsDetail',
      method: 'POST',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        if (res.data.code === 200) {
          const detail = res.data.data
          let targetImage = ''
          if(this.data.locale === 'zh-Hant') {
            targetImage = detail.targetImage || ''
          } else {
            targetImage = detail.targetImageEnglish || detail.targetImage || ''
          }
          const images = targetImage ? targetImage.split(',').filter(img => img) : []
          
          this.setData({
            goodsDetail: detail,
            goodsImages: images[0] || '',
            totalAmount: this.formatAmount(detail.targetAmount, this.data.buyNum)
          })
        } else {
          wx.showToast({
            title: res.data.msg || '加载失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  loadAddressList: function() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            addressList: res.data.rows || []
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
        }
      }
    })
  },

  // 显示地址选择弹窗
  showAddress: function() {
    this.setData({
      showAddressPopup: true
    })
  },

  // 隐藏地址选择弹窗
  hideAddress: function() {
    this.setData({
      showAddressPopup: false
    })
  },

  // 选择地址
  selectAddress: function(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      addressIndex: index,
      showAddressPopup: false
    })
  },

  // 添加新地址
  addAddress: function() {
    if (!app.checkLogin()) {
      return
    }

    wx.navigateTo({
      url: '/pages/mine/addressForm?type=add'
    })
  },

  // 提交订单
  submitOrder: function() {
    if (!app.checkLogin()) {
      return
    }

    if (!this.data.addressList[this.data.addressIndex]) {
      wx.showToast({
        title: t('common.choseAdd'),
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/buy',
      method: 'POST',
      data: {
        id: this.data.goodsDetail.id,
        buyNum: this.data.buyNum,
        addressId: this.data.addressList[this.data.addressIndex].id,
        payFinishUrl: '/pages/mine/index',
        payErrorUrl: '/pages/index/index'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          wx.navigateTo({
            url: '/pages/goods/payIndex?payUrl='+ encodeURIComponent(res.data.data)
          })
        } else if (res.data.code == '999999') {         
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const currentPageUrl = currentPage.route

          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          //首先关闭当前页面，也就是进入当前页面判断没有登录，然后重定向到登录页面
          //为什么没有定时，主要是因为不需要删除storage中的内容，因为重定向后，会重新登录
          console.log("the current Page Url is:" + currentPageUrl)
          wx.navigateTo({
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
  }
}) 