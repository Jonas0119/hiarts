import { t } from '../../utils/i18n'
const echarts = require('../../components/ec-canvas/echarts')
const pageBehavior = require('../../utils/pageBehavior')

const app = getApp()

Page({
  behaviors: [pageBehavior],
  data: {
    bannerList: [
      {
        image: '/static/images/banner.png'
      },
      {
        image: '/static/images/banner.png'
      },
      {
        image: '/static/images/banner.png'
      }
    ],
    users: 0,
    views: 0,
    hkd: 0,
    locale: 'zh-Hant',
    goodsList: [],
    chartOption: {
      grid: {
        left: '50px',
        right: '10px',
        bottom: '40px',
        top: '20px',
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          rotate: 40
        }
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
        min: 0.900,
      },
      series: [
        {
          data: [],
          type: 'line',
          lineStyle: {
            color: '#a80000' //改变折线颜色
          },
          itemStyle: {
            color: "#a80000"
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(173,40,40, 0.5)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(211,171,171, 0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      showChart: false, hkd: 0.9105
    }
  },

  onLoad() {
    // 设置默认语言
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ locale })

    this.getExchangeRate()
    this.getGoodsList()
    this.getStats()
  },

  // 切换语言
  changeLocale: function() {
    const newLocale = this.data.locale === 'zh-Hant' ? 'en' : 'zh-Hant'
    app.setLocale(newLocale)
    this.setData({ locale: newLocale })
  },

  // 获取汇率
  getExchangeRate() {
    wx.request({
      url: 'https://gw.antan-tech.com/api/data-platform/bigBaseMale/getForeignExchange',
      method: 'GET',
      success: (res) => {
        if (res.data.code === 200) {
          const hkdData = res.data.data.filter(item => item.code === 'hkd')
          if (hkdData.length > 0) {
            this.setData({
              hkd: hkdData[hkdData.length - 1].rtPreClose
            })
            const xAxisData = []
            const seriesData = []
            hkdData.forEach(item => {
              xAxisData.push(item.tradeDate.substring(5, 10))
              seriesData.push(item.rtPreClose)
            })
            this.setData({
              'chartOption.xAxis.data': xAxisData,
              'chartOption.series[0].data': seriesData,
              showChart: true
            }, () => {
              this.initChart()
            })
          }
        }
      }
    })
  },

  // 获取商品列表
  getGoodsList() {
    wx.request({
      url: 'https://gw.antan-tech.com/api/tjfae-space/GoodsApi/goodsList',
      method: 'POST',
      data: {
        pageNum: 1,
        pageSize: 4
      },
      success: (res) => {
        if (res.data.code === 200) {
          const goodsList = res.data.data.list.slice(0,4).map(item => ({
            ...item,
            displayImage: this.getImage(item)
          }))
          this.setData({
            goodsList
          })
        }
      }
    })
  },

  // 获取统计数据
  getStats() {
    // 访问量
    wx.request({
      url: 'https://gw.antan-tech.com/api/data-platform/dataCount/subjectCount?subjectCode=hjs',
      method: 'GET',
      success: (res) => {
        if (res.data.code === 200 && res.data.data.list.length > 0) {
          this.setData({
            views: res.data.data.list[0].count
          })
        }
      }
    })

    // 用户数
    wx.request({
      url: 'https://gw.antan-tech.com/api/data-platform/dataCount/userSubjectCount?subjectCode=hjs',
      method: 'GET',
      success: (res) => {
        if (res.data.code === 200 && res.data.data.list.length > 0) {
          this.setData({
            users: res.data.data.list[0].count
          })
        }
      }
    })
  },

  // 处理商品图片
  getImage(item) {
    let targetImage = ''
    if(this.data.locale === 'zh-Hant') {
      targetImage = item.targetImage
    } else {
      targetImage = item.targetImageEnglish
    }
    if (!targetImage) return ''
    
    const array = targetImage.split(',')
    if(array.length > 0) return array[0]
    return targetImage
  },

  // 跳转到商品详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goods/detail?id=${id}`
    })
  },

  // 跳转到商品列表
  goToList() {
    wx.switchTab({
      url: '/pages/goods/list'
    })
  },

  // 跳转到分类商品列表
  goToTypeList(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/goods/typeList?targetType=${type}`
    })
  },
  // 初始化图表
  initChart() {
    if (!this.ecComponent) {
      this.ecComponent = this.selectComponent('#mychart-dom-line')
    }

    if (this.ecComponent) {
      this.ecComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        })
        //chart.setOption(this.data.chartOption)
        chart.setOption(this.data.chartOption)
        return chart
      })
    }
  },

  openLocale: function() {
    let _this = this
    wx.showActionSheet({
      itemList: ['繁体', 'English'],
      success: function(res) {
        if (res.tapIndex == 1) {
          app.setLocale('en')
        } else {
          app.setLocale('zh-Hant')
        }
        
        _this.setData({
          locale: wx.getStorageSync('locale')
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})
