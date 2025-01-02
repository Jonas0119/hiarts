const app = getApp()
import { t } from '../../utils/i18n'

Page({
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

  formatAmount: function(targetAmount, buyedNum) {
    console.log("targetAmount:" + targetAmount)
    console.log("buyedNum:" + buyedNum)
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
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
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
        } else if (res.data.code === '999999') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.removeStorage({ key: 'accountId' })
            wx.removeStorage({ key: 'token' })
            wx.removeStorage({ key: 'phone' })
            wx.removeStorage({ key: 'headImg' })
            wx.removeStorage({ key: 'name' })
            wx.reLaunch({ url: '/pages/login/index' })
          }, 2000)
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
    wx.navigateTo({
      url: '/pages/mine/addressForm?type=add'
    })
  },

  // 提交订单
  submitOrder: function() {
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
        addressId: this.data.addressList[this.data.addressIndex].id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          console.log("the res data is" + res.data.data)
          wx.navigateTo({
            url: `/pages/goods/payIndex?payUrl=${res.data.data}`
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