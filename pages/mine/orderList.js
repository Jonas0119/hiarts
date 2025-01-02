const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    list: [],
    token: '',
    locale: 'zh-Hant'
  },

  onLoad: function() {
    this.setData({
      locale: wx.getStorageSync('locale') || 'zh-Hant'
    })

    let _this = this
    wx.getStorage({
      key: 'token',
      success: function(res) {
        _this.setData({
          token: res.data
        })
        _this.init()
      }
    })

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

  onPullDownRefresh: function() {
    this.init()
  },

  pickup: function(e) {
    const id = e.currentTarget.dataset.id
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
  },

  init: function() {
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
      success: (res) => {
        if (res.data.code === 200) {
          const orderList = res.data.data.list.map(item => ({
            ...item,
            targetImage: this.getImage(item.targetImage),
            targetImageEnglish: this.getImage(item.targetImageEnglish),
            //state: this.formateState(item.state)
          }))
          this.setData({
            list:orderList
          })
          //console.log('res.data.data.list is:', orderList)
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
      },
      complete: () => {
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
      url: '/pages/mine/orderDetail?id=' + id
    })
  },

  requestDelivery: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mine/orderDetail?id=' + id
    })
  }
}) 