const zhHant = {
  "index": {
    "users": "用戶數",
    "views": "訪問量",
    "exchange": "匯率走勢",
    "hkd": "港幣",
    "goods": "推薦商品",
    "all": "查看全部"
  },
  "goodsList": {
    "wait": "剩餘",
    "unit": "件",
    "price": "價格"
  }
}

const en = {
  "index": {
    "users": "Users",
    "views": "Views",
    "exchange": "Exchange Rate",
    "hkd": "HKD",
    "goods": "Recommended",
    "all": "View All"
  },
  "goodsList": {
    "wait": "Stock",
    "unit": "pcs",
    "price": "Price"
  }
}

const messages = {
  'zh-Hant': zhHant,
  'en': en
}

export const t = (key) => {
  const locale = wx.getStorageSync('locale') || 'zh-Hant'
  const keys = key.split('.')
  let value = messages[locale]
  
  if (!value) return key
  
  keys.forEach(k => {
    if (value) {
      value = value[k]
    }
  })
  return value || key
}
