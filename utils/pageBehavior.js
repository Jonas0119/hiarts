const { t, updateNavigationBarTitle, getCurrentLanguage } = require('./i18n');
const app = getApp();

module.exports = Behavior({
  properties: {
    navigationKey: {
      type: String,
      value: ''
    }
  },

  data: {
    locale: wx.getStorageSync('locale') || 'zh-Hant'
  },

  attached() {
    // 获取当前页面实例
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    // 更新导航栏标题
    updateNavigationBarTitle();
    
    // 监听语言变化
    if (app.watchLocale) {
      app.watchLocale((newLocale) => {
        this.setData({ locale: newLocale });
        if (this.onLocaleChange) {
          this.onLocaleChange(newLocale);
        }
        // 更新导航栏标题
        updateNavigationBarTitle();
      });
    }
  },

  detached() {
    const app = getApp();
    if (app.unwatchLocale) {
      app.unwatchLocale();
    }
  },

  pageLifetimes: {
    show() {
      // 检查语言是否发生变化
      const currentLocale = getCurrentLanguage();
      if (currentLocale !== this.data.locale) {
        this.setData({ locale: currentLocale });
        if (this.onLocaleChange) {
          this.onLocaleChange(currentLocale);
        }
      }
      // 每次显示页面时更新导航栏标题
      updateNavigationBarTitle();
    }
  },

  methods: {
    updateNavigationBarTitle() {
      if (this.data.navigationKey) {
        const title = t(`navigation.${this.data.navigationKey}`, this.data.locale);
        if (title) {
          wx.setNavigationBarTitle({
            title: title
          });
        }
      }
    }
  }
}); 