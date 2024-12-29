const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    userInfo: null,
    t: t
  },

  onLoad: function() {
    this.getUserInfo()
  },

  onShow: function() {
    //this.getUserInfo()
  },

  getUserInfo: function() {
    const token = wx.getStorageSync('token')
    console.log("用户token为:"+token)
    if (token) {
      
    } else {
      wx.navigateTo({
        url: '/pages/login/index'
      })
    } 
  },

  goToOrders: function() {
    wx.navigateTo({
      url: '/pages/mine/orderList'
    })
  },

  goToAddress: function() {
    wx.navigateTo({
      url: '/pages/mine/addressList'
    })
  },

  goToInvite: function() {
    wx.navigateTo({
      url: '/pages/mine/mineInvite'
    })
  },

  goToSettings: function() {
    wx.navigateTo({
      url: '/pages/mine/settings'
    })
  },

  goToAbout: function() {
    wx.navigateTo({
      url: '/pages/mine/about'
    })
  }
}) 