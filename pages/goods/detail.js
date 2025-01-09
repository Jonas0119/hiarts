const app = getApp()
import { t } from '../../utils/i18n'
const pageBehavior = require('../../utils/pageBehavior')

Page({
  behaviors: [pageBehavior],
  data: {
    id: '',
    goodsDetail: {},
    goodsImages: [],
    remainNum: 1,
    buyNum: 1,
    num: 1,
    locale: 'zh-Hant',
    t: t,
    multiLineText: '歡迎您參與購買本產品，為了讓您充分了解產品內容，特提供本《購買須知》。若您選擇參與本產品購買，則視為您已仔細閱讀本《購買須知》並自願承擔購買本數據資產所帶來的風險。在您購買本中心產品時需提前知悉，本平臺所發售的數據資產產品是以區塊鏈技術將相關產品、權益等資產上鏈標記，以確認您對該產品的權益。本平臺產品定價體系由項目底層資產價值評估構成，客戶決定購買即表示認同產品定價標準；本平臺產品僅在「合交所管理節點交易所「線上發售並結算。本平臺僅對產品進行形式審核，公示相關項目資料，客戶需自行與本產品運營機構及合作機構咨詢產品信息，並自主決定購買。鑒於您對本產品的購買意向，您需考慮自身情況是否適合進行此類產品的購買，客觀理性地認識到此類產品的風險',
    multiLineTextEnglish: 'You are welcome to participate in the purchase of this product, in order to let you fully understand the product content, we hereby provide this "Purchase Instructions". If you choose to participate in the purchase of this product, it is deemed that you have carefully read the Purchase Instructions and voluntarily assume the risk caused by the purchase of this data asset. When you purchase the products of the Center, you need to be aware in advance that the data asset products sold by the platform are tagged with related products, rights and interests by blockchain technology to confirm your rights and interests in the product. The product pricing system of this platform is composed of the evaluation of the underlying asset value of the project, and the customers decision to purchase indicates that he agrees with the product pricing standard; Products of the Platform are only sold and settled online in the "Stock Exchange Management Node Exchange". The Platform only conducts formal review of products and publicizes relevant project information, and customers are required to consult product information with the product operating institutions and cooperative institutions and decide to purchase products independently. In view of your intention to purchase this product, you should consider whether it is suitable for you to purchase such products, objectively and rationally recognize the risks of such products, and determine that you can bear the risks.'
  },

  onLoad: function (options) {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })

    if (options.id) {
      this.setData({
        id: options.id
      }, () => {
        this.loadGoodsDetail()
      })
    }

    this.localeChangeCallback = (newLocale) => {
      this.setData({ locale: newLocale }, () => {
        console.log("the locale is:" + newLocale)
        this.loadGoodsDetail()
      })
    }
    app.watchLocale(this.localeChangeCallback)
  },

  onShow: function() {
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    if (locale !== this.data.locale) {
      this.setData({ locale }, () => {
        if (this.data.id) {
          this.loadGoodsDetail()
        }
      })
    }
  },

  onUnload: function() {
    if (this.localeChangeCallback) {
      app.unwatchLocale(this.localeChangeCallback)
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
      },
      timeout: 6000,
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        console.log('商品详情返回:', res.data)
        if (res.data.code === 200) {
          const detail = res.data.data
          let targetImage = ''
          if(this.data.locale === 'zh-Hant') {
            targetImage = detail.targetImage || ''
          } else {
            targetImage = detail.targetImageEnglish || detail.targetImage || ''
          }
          const images = targetImage ? targetImage.split(',').filter(img => img) : []
          
          // 处理店铺图片
          let shopImage = ''
          try {
            if (detail.shopImage) {
              if (detail.shopImage.startsWith('[')) {
                const shopImages = JSON.parse(detail.shopImage)
                if (Array.isArray(shopImages) && shopImages.length > 0) {
                  shopImage = shopImages[0].url
                }
              } else {
                shopImage = detail.shopImage
              }
            }
          } catch(e) {
            //console.log('解析店铺图片错误:', e)
            shopImage = detail.shopImage
          }

          const remainNum = detail.stockNum - detail.buyedNum

          // 处理富文本内容
          const processRichText = (text) => {
            if (!text) return ''
            return text.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"')
          }

          this.setData({
            goodsDetail: {
              ...detail,
              shopImage,
              targetDesc: processRichText(detail.targetDesc || ''),
              targetDescEnglish: processRichText(detail.targetDescEnglish || ''),
              targetDescBrief: processRichText(detail.targetDescBrief || ''),
              targetDescBriefEnglish: processRichText(detail.targetDescBriefEnglish || '')
            },
            goodsImages: images,
            remainNum: remainNum,
            num: 1,
            buyNum: 1
          })

        } else {
          wx.showToast({
            title: res.data.msg || '加载失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.log('请求失败:', err)
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

  onNumChange: function(e) {
    const num = parseInt(e.detail.value) || 0
    this.setData({
      num: num,
      buyNum: num
    })
  },

  onBuyTap: function() {
    if (!app.checkLogin()) {
      return
    }

    if(this.data.num == 0) {
      wx.showToast({
        title: t('common.tipNum'),
        icon: 'none'
      })
      return
    } else if(this.data.num > this.data.remainNum) {
      wx.showToast({
        title: t('common.tipTopNum'),
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: `/pages/goods/pay?id=${this.data.id}&number=${this.data.num}`
    })
  }
}) 