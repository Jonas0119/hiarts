import { t } from '../../utils/i18n'
const echarts = require('../../components/ec-canvas/echarts')

const app = getApp()

Page({
  data: {
    bannerList: [
      { image: '/static/images/banner.png' },
      { image: '/static/images/banner.png' },
      { image: '/static/images/banner.png' }
    ],
    users: '--',
    views: '--',
    exchangeRate: '',
    hkd: 0.9105,
    showChart: false,
    ec: {
      lazyLoad: true
    },
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
      series: [{
        data: [],
        type: 'line',
        lineStyle: {
          color: '#a80000'
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
              offset: 0,
              color: 'rgba(173,40,40, 0.5)'
            }, {
              offset: 1,
              color: 'rgba(211,171,171, 0)'
            }],
            global: false
          }
        }
      }]
    },
    goodsList: [],
    locale: 'zh-Hant',
    t: t
  },

  onLoad() {
    // 设置默认语言
    const locale = wx.getStorageSync('locale') || 'zh-Hant'
    this.setData({ 
      locale,
      t: (key) => t(key, locale)
    })

    console.log('Banner List:', this.data.bannerList)

    this.getExchangeRate()
    this.getGoodsList()
    this.getStats()
  },

  // 获取汇率
  getExchangeRate() {
    wx.request({
      url: 'https://gw.antan-tech.com/api/data-platform/bigBaseMale/getForeignExchange',
      method: 'GET',
      success: (res) => {
        console.log('汇率数据:', res.data)
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
      },
      fail: (err) => {
        console.error('获取汇率失败:', err)
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
        console.log('商品列表:', res.data)
        if (res.data.code === 200) {
          this.setData({
            goodsList: res.data.data.list
          })
        }
      },
      fail: (err) => {
        console.error('获取商品列表失败:', err)
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
        console.log('访问量:', res.data)
        if (res.data.code === 200 && res.data.data.list.length > 0) {
          this.setData({
            views: res.data.data.list[0].count
          })
        }
      },
      fail: (err) => {
        console.error('获取访问量失败:', err)
      }
    })

    // 用户数
    wx.request({
      url: 'https://gw.antan-tech.com/api/data-platform/dataCount/userSubjectCount?subjectCode=hjs',
      method: 'GET',
      success: (res) => {
        console.log('用户数:', res.data)
        if (res.data.code === 200 && res.data.data.list.length > 0) {
          this.setData({
            users: res.data.data.list[0].count
          })
        }
      },
      fail: (err) => {
        console.error('获取用户数失败:', err)
      }
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
        return chart
      })
    } else {
      console.error('找不到图表组件')
    }
  },

  // 切换语言
  changeLocale() {
    wx.showActionSheet({
      itemList: ['繁體', 'English'],
      success: (res) => {
        const locale = res.tapIndex === 1 ? 'en' : 'zh-Hant'
        this.setData({ 
          locale,
          t: (key) => t(key, locale)
        })
        wx.setStorageSync('locale', locale)
        // 刷新页面数据
        this.getGoodsList()
      }
    })
  },

  // 跳转到商品详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goodDetail/detail?id=${id}`
    })
  },

  // 跳转到商品列表
  goToList() {
    wx.switchTab({
      url: '/pages/goodList/list'
    })
  },

  // 跳转到分类商品列表
  goToTypeList(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/goodList/typeList?targetType=${type}`
    })
  },

  // 用于模板中使用 t 函数
  t(key) {
    return t(key, this.data.locale)
  }
})
