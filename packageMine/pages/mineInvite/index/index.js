import { t } from '../../../../utils/i18n'
const pageBehavior = require('../../../../utils/pageBehavior')
import uQRCode from '../../../../utils/uqrcode.js'

const app = getApp()

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
    if (!app.checkLogin()) return
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
    uQRCode.make({
      canvasId: 'qrcode',
      componentInstance: this,
      text: this.data.shareUrl + this.data.phone,
      size: 200,
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
        if (res.data.code === 200) {
          const invList = res.data.rows.map(item => ({
            ...item,
            inviteTime: item.inviteTime.split(" ")[0]
          }))
          this.setData({
            invitedList: invList,
            total: res.data.total
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