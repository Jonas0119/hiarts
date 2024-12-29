const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    inviteCode: '',
    inviteLink: '',
    qrcode: '',
    invitedList: [],
    total: 0,
    t: t
  },

  onLoad: function() {
    //this.loadInviteInfo()
    this.loadInvitedList()
  },

    loadInviteInfo: function () {
        wx.request({
            url: 'http://gw.antan-tech.com/paasapi/usercenter/user/v2/getMyInviteList',
            method: 'GET',
            data: {
                pageNum: 1,
                pageSize: 10,
                cellphone: this.phone,
                subject: 'hjs'
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
                        inviteCode: res.data.data.inviteCode,
                        inviteLink: res.data.data.inviteLink,
                        qrcode: res.data.data.qrcode
                    })
                }
            }
        })
    },

    loadInvitedList: function () {
        wx.request({
            url: 'https://gw.antan-tech.com/paasapi/usercenter/user/v2/getMyInviteList',
            method: "POST",
            data: {
                pageNum: 1,
                pageSize: 10,
                cellphone: wx.getStorageSync('phone'),
                subject: 'hjs'
            },
            header: {
                'content-type': "application/x-www-form-urlencoded",
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            timeout: 6000,
            sslVerify: false,
            withCredentials: false,
            firstIpv4: false,
            success: (res) => {
                console.log("用户手机号:" + wx.getStorageSync('phone'))
                console.log("邀请列表调用返回:" + res.data.rows)
                console.log("邀请列表总数:" + res.data.total)
                console.log("邀请调用返回code:" + res.data.code)
                if (res.data.code === 200) {
                    this.setData({
                        invitedList: res.data.rows,
                        total: res.data.total
                    })
                } else if (res.data.code === 999999) {
                    wx.clearStorageSync()
                    wx.reLaunch({
                        url: '/pages/login/index'
                    })
                }
            }
        })
    },

  copyCode: function() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => {
        wx.showToast({
          title: t('common.copied')
        })
      }
    })
  },

  copyLink: function() {
    wx.setClipboardData({
      data: this.data.inviteLink,
      success: () => {
        wx.showToast({
          title: t('common.copied')
        })
      }
    })
  },

  saveQrcode: function() {
    wx.showLoading({
      title: t('common.saving')
    })

    wx.downloadFile({
      url: this.data.qrcode,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: t('common.saved')
            })
          },
          fail: () => {
            wx.showToast({
              title: t('common.saveFailed'),
              icon: 'none'
            })
          }
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
}) 