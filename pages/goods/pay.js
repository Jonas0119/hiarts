const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    id: '',
    buyNum: 1,
    goodsDetail: {},
    goodsImages: '',
    totalAmount: 0,
    addressList: [],
    selectedAddress: null,
    selectedAddressIndex: -1,
    showAddressPopup: false,
    t: t
  },

  onLoad: function(options) {
    if (options.id && options.number) {
      this.setData({
        id: options.id,
        buyNum: parseInt(options.number)
      })
      this.loadGoodsDetail()
      this.loadAddressList()
    }
  },

  loadGoodsDetail: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsDetail',
      method: 'POST',
      data: {
        id: this.data.id
      },
      header:{'content-type' : "application/x-www-form-urlencoded"},
      success: (res) => {
        if (res.data.code === 200) {
          const detail = res.data.data
          const images = detail.targetImage.split(',')
          
          this.setData({
            goodsDetail: detail,
            goodsImages: images[0],
            totalAmount: (detail.targetAmount * this.data.buyNum).toFixed(2)
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
      }
    })
  },

  loadAddressList: function() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/list',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            addressList: res.data.rows
          })
        }
      }
    })
  },

  showAddressPicker: function() {
    this.setData({
      showAddressPopup: true
    })
  },

  hideAddressPicker: function() {
    this.setData({
      showAddressPopup: false
    })
  },

  selectAddress: function(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedAddress: this.data.addressList[index],
      selectedAddressIndex: index,
      showAddressPopup: false
    })
  },

  addNewAddress: function() {
    wx.navigateTo({
      url: '/pages/address/form'
    })
  },

  submitOrder: function() {
    if (!this.data.selectedAddress) {
      wx.showToast({
        title: t('common.choseAdd'),
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/buy',
      method: 'POST',
      data: {
        id: this.data.id,
        buyNum: this.data.buyNum,
        addressId: this.data.selectedAddress.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          // 跳转到支付页面
          wx.navigateTo({
            url: `/pages/goods/payIndex?payUrl=${res.data.data}`
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
      }
    })
  }
}) 