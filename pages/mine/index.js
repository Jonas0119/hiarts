import { t } from '../../utils/i18n'

Page({
  data: {
    userInfo: null,
    orderStats: {
      unpaid: 0,
      unshipped: 0,
      shipped: 0,
      completed: 0
    },
    menuList: [
      {
        icon: '/static/images/order.png',
        name: t('mine.myOrders'),
        path: '/pages/order/list'
      },
      {
        icon: '/static/images/address.png',
        name: t('mine.address'),
        path: '/pages/address/list'
      },
      {
        icon: '/static/images/invite.png',
        name: t('mine.invite'),
        path: '/pages/invite/index'
      },
      {
        icon: '/static/images/settings.png',
        name: t('mine.settings'),
        path: '/pages/settings/index'
      }
    ]
  },

  onLoad() {
    this.getUserInfo()
    this.getOrderStats()
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      this.setData({ userInfo })
    } else {
      // 未登录状态
      this.setData({ userInfo: null })
    }
  },

  getOrderStats() {
    wx.request({
      url: 'http://gw.antan-tech.com/api/order/stats',
      success: (res) => {
        if(res.data.code === 200) {
          this.setData({
            orderStats: res.data.data
          })
        }
      }
    })
  },

  // 登录
  login() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
      }
    })
  },

  // 跳转到对应页面
  navigate(e) {
    const path = e.currentTarget.dataset.path
    if(!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({ url: path })
  }
}) 