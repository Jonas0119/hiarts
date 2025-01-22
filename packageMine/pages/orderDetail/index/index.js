import { t } from '../../../../utils/i18n'
const pageBehavior = require('../../../../utils/pageBehavior')

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
    showAddressPopup: false
  },

  onLoad: function (options) {
    if (!app.checkLogin()) return

    this.setData({
      id: options.id,
      date: this.getDate()
    })

    wx.getStorage({
      key: 'token',
      success: res => {
        this.setData({ token: res.data })
        this.init()
      }
    })
  },

  // 语言变化时重新加载数据
  onLocaleChange: function() {
    this.init()
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
      url: '/packageMine/pages/addressForm/index/index?type=add'
    })
  },

  take() {
    if (!this.data.addressList[this.data.chose]) {
      wx.showToast({
        title: t('order.chooseAddress', this.data.locale),
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
          wx.showToast({
            title: t('common.success', this.data.locale),
            icon: 'none'
          })
          wx.redirectTo({
            url: '/packageMine/pages/orderList/index/index'
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
        'Authorization': 'Bearer ' +  this.data.token
      },
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            addressList: res.data.rows
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
          console.log('getAdd res.data.msg is:'+res.data.rows)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  getImage(item) {
    let targetImage = ''
    if(this.data.locale === 'zh-Hant' || this.data.locale === 'zh-Hans') {
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
          console.log('init res.data is:'+res.data)
          const targetImage = this.getImage(res.data.data)
          this.setData({
            targetImage: this.getImage(res.data.data),
            obj: res.data.data,
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