const app = getApp()
import { t } from '../../../../utils/i18n'
const pageBehavior = require('../../../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    goodsDetail: {},
    goodsImages: '',
    buyNum: 1,
    totalAmount: 0,
    addressList: [],
    addressIndex: 0,
    showAddressPopup: false,
    wxOpenId:'',
    payMethod: '1'  // 默认微信支付
  },

  onLoad: function(options) {
    if (!app.checkLogin()) {
      return
    }

    if (options.id && options.number) {
      this.loadGoodsDetail(options.id)
      this.setData({
        buyNum: parseInt(options.number),
      })
    }

    this.loadAddressList()
    this.getOpenid()
  },

  onShow: function() {
    this.loadAddressList()
  },

  // 语言变化时重新加载数据
  onLocaleChange: function() {
    if (this.data.goodsDetail.id) {
      this.loadGoodsDetail(this.data.goodsDetail.id)
    }
  },

  formatAmount: function(targetAmount, buyedNum) {
    return (Number(targetAmount) * Number(buyedNum)).toFixed(2)
  },

  getOpenid: function () {
    // 1. 调用 wx.login 获取 code
    wx.login({
      success: (res) => {
        if (res.code) {
          //console.log('weixin code is:', res.code);
          // 2. 将 code 发送到后端
          wx.request({
            url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/pay/getOpenId',
            method: 'POST',
            data: {
              jsCode: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${wx.getStorageSync('token')}`
            },
            success: (response) => {
              // 3. 获取后端返回的 openid
              if (response.data.code === 200) {
                this.setData({
                  openId: response.data.data
                });
                console.log('current user openid:', this.data.openId);
              }
            },
            fail: (error) => {
              console.error('请求失败:', error);
            },
          });
        } else {
          console.error('获取 code 失败:', res.errMsg);
        }
      },
      fail: (error) => {
        console.error('wx.login 调用失败:', error);
      },
    })
  },


  loadGoodsDetail: function(id) {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsDetail',
      method: 'POST',
      data: { id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        if (res.data.code === 200) {
          const detail = res.data.data
          let targetImage = ''
          if(this.data.locale === 'zh-Hant' || this.data.locale === 'zh-Hans') {
            targetImage = detail.targetImage || ''
          } else {
            targetImage = detail.targetImageEnglish || detail.targetImage || ''
          }
          const images = targetImage ? targetImage.split(',').filter(img => img) : []
          
          this.setData({
            goodsDetail: detail,
            goodsImages: images[0] || '',
            totalAmount: this.formatAmount(detail.targetAmount, this.data.buyNum)
          })
        } else {
          wx.showToast({
            title: res.data.msg || '加载失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  loadAddressList: function() {
    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/goodsAddress/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            addressList: res.data.rows || []
          })
        } else if (res.data.code == '999999') {          
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const currentPageUrl = currentPage.route

          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          wx.navigateTo({
            url: `/pages/login/index?redirect=${encodeURIComponent(currentPageUrl)}`
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  showAddress: function() {
    this.setData({ showAddressPopup: true })
  },

  hideAddress: function() {
    this.setData({ showAddressPopup: false })
  },

  selectAddress: function(e) {
    this.setData({
      addressIndex: e.currentTarget.dataset.index,
      showAddressPopup: false
    })
  },

  addAddress: function() {
    if (!app.checkLogin()) return
    wx.navigateTo({
      url: `/packageMine/pages/addressForm/index/index?type=add`
    })
  },

  selectPayMethod: function(e) {
    this.setData({
      payMethod: e.currentTarget.dataset.method
    })
  },

  wxPay: function (jsonString) {
    const payData = JSON.parse(jsonString);
    const timeStamp = payData.timeStamp;
    const nonceStr = payData.nonceStr;
    const pack = payData.package;
    const signType = payData.signType;
    const paySign = payData.paySign;
    const appId = payData.appId;
    const orderId = payData.orderId;
    wx.requestPayment({
      "timeStamp": timeStamp,
      "nonceStr": nonceStr,
      "package": pack,
      "signType": signType,
      "paySign": paySign,
      "success": (res) => {
        wx.showToast({
          title: t('common.success'),
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: '/packageMine/pages/orderList/index/index'
              })
            }, 2000)
          }
        })
      },
      "fail": (res) => {
        var detailMessage = res.errMsg;
        wx.showToast({
          title: t('common.payFailed'),
          icon: 'none',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: '/packageMine/pages/orderDetail/index/index?id=' + orderId
              })
            }, 2000)
          }
        })
      }
    })
  },

  submitOrder: function() {
    if (!app.checkLogin()) return

    if (!this.data.addressList[this.data.addressIndex]) {
      wx.showToast({
        title: t('common.choseAdd'),
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/buy',
      method: 'POST',
      data: {
        id: this.data.goodsDetail.id,
        buyNum: this.data.buyNum,
        addressId: this.data.addressList[this.data.addressIndex].id,
        payFinishUrl: '/pages/mine/index',
        payErrorUrl: '/pages/index/index',
        wxPay: this.data.payMethod,
        openId:this.data.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data != null && res.data.data != undefined) {
          if(this.data.payMethod=='0'){
            wx.navigateTo({
              url: '/packageGoods/pages/payIndex/index/index?payUrl=' + encodeURIComponent(res.data.data)
            })
          } else if(this.data.payMethod=='1'){
            this.wxPay(res.data.data)
          }
        } else if (res.data.code == '999999') {         
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const currentPageUrl = currentPage.route

          wx.redirectTo({
            url: `/pages/login/index?redirect=${encodeURIComponent(currentPageUrl)}`
          })
        } else {
          wx.showToast({
            title: res.data.msg || '请联系客户经理',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
}) 