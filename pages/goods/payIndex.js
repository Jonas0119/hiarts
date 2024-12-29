Page({
  data: {
    payUrl: ''
  },

  onLoad: function(options) {
    if (options.payUrl) {
      this.setData({
        payUrl: decodeURIComponent(options.payUrl)
      })
    }
  },

  onWebViewLoad: function() {
    console.log('WebView loaded')
  },

  handleMessage: function(e) {
    console.log('WebView message:', e.detail)
  }
}) 