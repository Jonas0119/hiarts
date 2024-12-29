const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    userInfo: null,
    t: t,
    menuList: [
      {
        id: 'orders',
        icon: '/static/images/order.png',
        text: 'mine.myOrder',
        url: '/pages/mine/orderList'
      },
      {
        id: 'address',
        icon: '/static/images/address.png',
        text: 'mine.address',
        url: '/pages/mine/addressList'
      },
      {
        id: 'invite',
        icon: '/static/images/invite.png',
        text: 'mine.invite',
        url: '/pages/mine/mineInvite'
      },
      {
        id: 'settings',
        icon: '/static/images/settings.png',
        text: 'index.setting',
        url: '/pages/mine/settings'
      },
      {
        id: 'about',
        icon: '/static/images/about.png',
        text: 'mine.about',
        url: '/pages/mine/about'
      }
    ]
  },

  onLoad: function() {
    this.checkLoginAndGetUserInfo()
  },

  onShow: function() {
    this.checkLoginAndGetUserInfo()
  },

  checkLoginAndGetUserInfo: function() {
    if (!app.checkLogin()) {
      return
    }
    this.getUserInfo()
  },

  getUserInfo: function() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 获取用户信息的API调用
      wx.request({
        url: app.globalData.baseUrl + '/usercenter/userApp/center/getUserInfo',
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: (res) => {
          if (app.handleApiResponse(res, (response) => {
            if (response.data.code === 200) {
              this.setData({
                userInfo: {
                  name: wx.getStorageSync('name'),
                  headImg: wx.getStorageSync('headImg'),
                  phone: wx.getStorageSync('phone')
                }
              })
            }
          })) {
            // API响应处理成功
          }
        }
      })
    }
  },

  onMenuTap: function(e) {
    const url = e.currentTarget.dataset.url
    if (!app.checkLogin()) return
    wx.navigateTo({ url })
  }
}) 