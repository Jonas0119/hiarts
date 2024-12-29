const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    version: '1.0.0',
    contact: {
      phone: '400-888-8888',
      email: 'support@example.com',
      address: '香港特别行政区'
    },
    t: t
  },

  makeCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.contact.phone
    })
  },

  copyEmail: function() {
    wx.setClipboardData({
      data: this.data.contact.email,
      success: () => {
        wx.showToast({
          title: t('common.copied')
        })
      }
    })
  }
}) 