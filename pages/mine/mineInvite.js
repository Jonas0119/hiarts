import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    inviteCode: '',
    inviteLink: '',
    qrcode: '',
    phone: '',
    invitedList: [],
    shareUrl: 'http://218.244.138.12:8086/webHJL/#/pages/login/index?phone=',
    total: 0,
    t: t,
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  onLoad: function () {
    // 获取用户信息
    this.setData({
      phone: wx.getStorageSync('phone') || '',
    }, () => {
      this.loadInviteInfo()
      this.generateQRCode()
    })
  },

  onShow: function() {
    // 在页面显示时检查语言是否变化
    const currentLocale = wx.getStorageSync('locale') || 'zh-Hant'
    if (currentLocale !== this.data.locale) {
      this.setData({
        locale: currentLocale
      })
    }
  },

  generateQRCode: function() {
    console.log('this.data.shareUrl:' + this.data.shareUrl)
    console.log('this.data.phone:' + this.data.phone)
    uQRCode.make({
      canvasId: 'qrcode',
      componentInstance: this,
      text: this.data.shareUrl + this.data.phone,
      size: 150,
      margin: 0,
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      fileType: 'jpg',
      errorCorrectLevel: uQRCode.errorCorrectLevel.H,
      success: () => {}
    })
  },

  loadInviteInfo: function () {
    wx.request({
      url: 'https://gw.antan-tech.com/paasapi/usercenter/user/v2/getMyInviteList',
      method: 'POST',
      data: {
        pageNum: 1,
        pageSize: 10,
        cellphone: wx.getStorageSync('phone') || '',
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
        console.log('res.data.total is:' + res.data.total)
        console.log('res.data.list:' + res.data.rows)
        console.log('res.data.code:' + res.data.code)
        if (res.data.code === 200) {
          const invList = res.data.rows.map(item => ({
            ...item,
            inviteTime: item.inviteTime.split(" ")[0]
          }))
          this.setData({
            invitedList: invList,
            total: res.data.total
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