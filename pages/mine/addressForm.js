const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    form: {
      id: '',
      receiveName: '',
      receiveMobile: '',
      address: ''
    },
    t: t
  },

  onLoad: function(options) {
    if (options.id) {
      this.loadAddressDetail(options.id)
    }
  },

  loadAddressDetail: function(id) {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/detail',
      method: 'GET',
      data: { id },
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            form: res.data.data
          })
        }
      }
    })
  },

  onInput: function(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },

  saveAddress: function() {
    const { form } = this.data

    if (!form.receiveName) {
      wx.showToast({
        title: t('mine.inputName'),
        icon: 'none'
      })
      return
    }

    if (!form.receiveMobile) {
      wx.showToast({
        title: t('mine.inputPhone'),
        icon: 'none'
      })
      return
    }

    if (!form.address) {
      wx.showToast({
        title: t('mine.inputAddress'),
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/save',
      method: 'POST',
      data: form,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: t('common.success')
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  deleteAddress: function() {
    wx.showModal({
      title: t('common.tips'),
      content: t('common.confirmDelete'),
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/delete',
            method: 'POST',
            data: { id: this.data.form.id },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${wx.getStorageSync('token')}`
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: t('common.success')
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
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