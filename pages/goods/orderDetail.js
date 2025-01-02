const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    id: '',
    orderDetail: {},
    addressList: [],
    chose: 0,
    date: '',
    pickupRemark: '',
    showAddress: false,
    locale: 'zh-Hant'
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id,
        locale: wx.getStorageSync('locale') || 'zh-Hant',
        date: this.getDate()
      })
      this.loadOrderDetail()
      this.loadAddressList()
    }

    // 监听语言变化
    this.localeChangeCallback = (newLocale) => {
      this.setData({ locale: newLocale })
    }
    app.watchLocale(this.localeChangeCallback)
  },

  onUnload: function() {
    if (this.localeChangeCallback) {
      app.unwatchLocale(this.localeChangeCallback)
    }
  },

  getDate: function(type) {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    if (type === 'start') {
      year = year
    } else if (type === 'end') {
      year = year + 2
    }
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
    return `${year}-${month}-${day}`
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTextAreaBlur: function(e) {
    this.setData({
      pickupRemark: e.detail.value
    })
  },

  showAddress: function() {
    this.loadAddressList()
    this.setData({
      showAddress: true
    })
  },

  hideAddress: function() {
    this.setData({
      showAddress: false
    })
  },

  choseA: function(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      chose: index,
      showAddress: false
    })
  },

  addAddress: function() {
    wx.navigateTo({
      url: '/pages/mine/addressForm?type=add'
    })
  },

  take: function() {
    if (!this.data.addressList[this.data.chose]) {
      wx.showToast({
        title: t('common.choseAdd'),
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/order/pickup/add',
      method: 'POST',
      data: {
        orderId: this.data.id,
        addressId: this.data.addressList[this.data.chose].id,
        pickupNum: this.data.orderDetail.buyedNum,
        pickupTime: this.data.date + ' 00:00:00',
        pickupRemark: this.data.pickupRemark
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: t('common.success'),
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/mine/orderList'
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

  loadOrderDetail: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/order/detail',
      method: 'POST',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            orderDetail: res.data.data
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
      url: app.globalData.baseUrl + '/tjfae-space/address/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            addressList: res.data.rows
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

  getStatusText: function(state) {
    if (state === 'paying') {
      return t('order.unPay')
    } else if (state === 'finishPay') {
      return t('order.unget')
    } else if (state === 'waitSend') {
      return t('order.unsend')
    } else if (state === 'finishSend') {
      return t('order.sended')
    } else if (state === 'finishOrder') {
      return t('order.done')
    }
    return ''
  }
}) 