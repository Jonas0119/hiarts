import zhHant from '../locale/zh-Hant.json'
import en from '../locale/en.json'

const messages = {
  'zh-Hant': zhHant,
  'en': en
}

export const t = (key, locale = wx.getStorageSync('locale') || 'zh-Hant') => {
  const keys = key.split('.')
  let value = messages[locale]
  
  if (!value) return key
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }
  
  return value || key
}

export const getCurrentLocale = () => {
  return wx.getStorageSync('locale') || 'zh-Hant'
}

export const setLocale = (locale) => {
  wx.setStorageSync('locale', locale)
}
