const app = getApp()
import { t } from '../../utils/i18n'

Page({
  data: {
    id: '',
    goodsDetail: {},
    goodsImages: [],
    remainNum: 1,
    buyNum: 1,
    tips: t('goodsDetail.tipsWord'),
    t: t
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      console.log('onload detail 商品id:', options.id)
      this.loadGoodsDetail()
    }
  },

  loadGoodsDetail: function() {
    wx.showLoading({
      title: t('common.loading')
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsDetail',
      method: 'POST',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        console.log('商品id:', this.data.id)
        console.log('商品详情:', res.data)
        if (app.handleApiResponse(res, (response) => {
          if (response.data.code === 200) {
            const detail = response.data.data
            // 处理商品图片
            const images = detail.targetImage.split(',')
            
            // 处理店铺图片
            let shopImage = ''
            try {
              const shopImages = JSON.parse(detail.shopImage)[0]
              shopImage = shopImages.url
            } catch(e) {
              shopImage = detail.shopImage
            }

            this.setData({
              goodsDetail: {
                ...detail,
                shopImage
              },
              goodsImages: images,
              remainNum: detail.stockNum - detail.buyedNum
            })
          } else {
            wx.showToast({
              title: response.data.msg,
              icon: 'none'
            })
          }
        })) {
          // API响应处理成功
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  onNumChange: function(e) {
    const value = parseInt(e.detail.value)
    this.setData({
      buyNum: value
    })
  },

  onBuyTap: function() {
    const { buyNum, remainNum } = this.data
    
    // 检查登录状态
    const app = getApp()
    if (!app.checkLogin()) {
      return
    }

    if (buyNum <= 0) {
      wx.showToast({
        title: t('common.tipNum'),
        icon: 'none'
      })
      return
    }

    if (buyNum > remainNum) {
      wx.showToast({
        title: t('common.tipTopNum'),
        icon: 'none'
      })
      return
    }

    // 跳转到支付页面
    console.log('跳转到支付页面:', this.data.id, buyNum)
    wx.navigateTo({
      url: `/pages/goods/pay?id=${this.data.id}&number=${buyNum}`
    })
  }
}) 