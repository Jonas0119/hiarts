const app = getApp()

Page({
  data: {
    id: '',
    goodsDetail: {},
    goodsImages: [],
    remainNum: 1,
    buyNum: 1,
    tips: '欢迎您参与购买本产品，为了让您充分了解产品内容，特提供本《购买须知》。若您选择参与本产品购买，则视为您已仔细阅读本《购买须知》并自愿承担购买本数据资产所带来的风险。在您购买本中心产品时需提前知悉，本平台所发售的数据资产产品是以区块链技术将相关产品、权益等资产上链标记，以确认您对该产品的权益。'
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
      title: '加载中...'
    })

    wx.request({
      url: app.globalData.baseUrl + '/tjfae-space/GoodsApi/goodsDetail',
      method: 'POST',
      data: {
        id: this.data.id
      },
      header:{'content-type' : "application/x-www-form-urlencoded"},
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        console.log('商品id:', this.data.id)
        console.log('商品详情:', res.data)
        if (res.data.code === 200) {
          const detail = res.data.data
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
            title: res.data.msg,
            icon: 'none'
          })
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

    if (buyNum <= 0) {
      wx.showToast({
        title: '请输入购买数量',
        icon: 'none'
      })
      return
    }

    if (buyNum > remainNum) {
      wx.showToast({
        title: '购买数量不能大于剩余数量',
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