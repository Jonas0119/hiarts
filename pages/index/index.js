import { t } from '../../utils/i18n'
const echarts = require('../../components/ec-canvas/echarts')

const app = getApp()

Page({
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
    ec: {
      lazyLoad: true
    },
    chartOption: {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          rotate: 40,
          color: '#666',
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        splitLine:{ show:false },
        min:0.900,  
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [{
        type: 'line',
        smooth: true,
        data: [],
        symbol: 'none',
        itemStyle: {
          color: '#FF6B00'
        },
        lineStyle: {
          color: '#FF6B00',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(255, 107, 0, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(255, 107, 0, 0)'
          }])
        }
      }]
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
  changeLocale() {
    wx.showActionSheet({
      itemList: ['繁體', 'English'],
      success: (res) => {
        const locale = res.tapIndex === 1 ? 'en' : 'zh-Hant'
        this.setData({ locale })
        wx.setStorageSync('locale', locale)
        // 刷新商品列表以更新图片
        this.getGoodsList()
      }
    })
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
            
            // 更新图表数据
            const xAxisData = []
            const seriesData = []
            hkdData.forEach(item => {
              xAxisData.push(item.tradeDate.substring(5, 10))
              seriesData.push(item.rtPreClose)
            })
            
            const newOption = {
              ...this.data.chartOption,
              xAxis: {
                ...this.data.chartOption.xAxis,
                data: xAxisData
              },
              series: [{
                ...this.data.chartOption.series[0],
                data: seriesData
              }]
            }
            
            this.setData({
              chartOption: newOption
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
        chart.setOption(this.data.chartOption)
        this.chart = chart
        return chart
      })
    }
  }
})
