import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

const app = getApp()

Page({
  behaviors: [pageBehavior],
  data: {
    id: '',
    obj: {},
    token: '',
    addressList: [],
    date: '',
    chose: 0,
    pickupRemark: '',
    locale: 'zh-Hant',
    showAddressPopup: false
  },

  onLoad: function (options) {
    this.setData({
      id: options.id,
      date: this.getDate(),
      locale: wx.getStorageSync('locale') || 'zh-Hant'
    })

    wx.getStorage({
      key: 'token',
      success: res => {
        this.setData({ token: res.data })
        this.init()
      }
    })
  },

  getDate(type) {
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

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTextAreaBlur(e) {
    this.setData({
      pickupRemark: e.detail.value
    })
  },

  showAddress() {
    this.getAdd()
    this.setData({
      showAddressPopup: true
    })
  },

  choseAddress(e) {
    this.setData({
      chose: e.currentTarget.dataset.index,
      showAddressPopup: false
    })
  },

  addAddress() {
    wx.navigateTo({
      url: '/pages/mine/addressForm?type=add'
    })
  },

  take() {
    if (!this.data.addressList[this.data.chose]) {
      wx.showToast({
        title: '請選擇地址',
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsPickup/add',
      method: 'POST',
      data: {
        orderId: this.data.id,
        addressId: this.data.addressList[this.data.chose].id,
        pickupNum: this.data.obj.buyedNum,
        pickupTime: this.data.date + ' 00:00:00',
        pickupRemark: this.data.pickupRemark
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.data.token
      },
      success: (res) => {
        if (res.data.code == 200) {
          console.log('take res.data.data is:'+res.data.data)
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/mine/orderList'
          })
        } else {
          console.log('take res.data.msg is:'+res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  getAdd() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.data.token
      },
      success: (res) => {
        if (res.data.code == 200) {
          console.log('getAdd res.data.rows is:'+res.data.rows)
          this.setData({
            addressList: res.data.rows
          })
        } else {
          onsole.log('getAdd res.data.msg is:'+res.data.rows)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  init() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/orderDetail',
      method: 'POST',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.data.token
      },
      success: (res) => {
        if (res.data.code == 200) {
          console.log('init res.data.data is:'+res.data.data)
          this.setData({
            obj: res.data.data
          })
        } else {
          console.log('init res.data.msg is:'+res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

    this.getAdd()
  }
}) 