const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    addressList: [],
    t: t
  },

  onLoad: function() {
    this.loadAddressList()
  },

  onShow: function() {
    this.loadAddressList()
  },

    loadAddressList: function () {
        wx.request({
            url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/list',
            method: 'GET',
            data: {
                pageNum: 1,
                pageSize: 100,
            },
            header: {
                'content-type': "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${wx.getStorageSync('token')}`
            },
            timeout: 6000,
            sslVerify: false,
            withCredentials: false,
            firstIpv4: false,
            success: (res) => {
                if (res.data.code === 200) {
                    this.setData({
                        addressList: res.data.rows
                    })
                }
            }
        })
    },

  selectAddress: function(e) {
    const id = e.currentTarget.dataset.id
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    if (prevPage && prevPage.route.includes('pay')) {
      const address = this.data.addressList.find(item => item.id === id)
      prevPage.setData({
        selectedAddress: address,
        selectedAddressIndex: this.data.addressList.findIndex(item => item.id === id)
      })
      wx.navigateBack()
    }
  },

  addAddress: function() {
    wx.navigateTo({
      url: '/pages/mine/addressForm'
    })
  },

  editAddress: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/mine/addressForm?id=${id}`
    })
  },

  deleteAddress: function(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: t('common.tips'),
      content: t('common.confirmDelete'),
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/delete',
            method: 'POST',
            data: { id },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${wx.getStorageSync('token')}`
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: t('common.success')
                })
                this.loadAddressList()
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  }
}) 