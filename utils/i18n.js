// 导入翻译文本
const translations = {
  'en': {
    "goodsDetail": {
      "goodsDetail": "Product details",
      "orderPay": "Order payment",
      "saleTime": "Sale stop time",
      "saleProgress": "Product application progress",
      "goodPrice": "Unit price of goods",
      "num": "Quantity issued",
      "shopinfor": "Quality store recommendation",
      "shotContent": "Product Description",
      "tips": "Purchase Instructions",
      "description": "Product description",
      "buyNum": "Subscription quantity",
      "tipsWord": "You are welcome to participate in the purchase of this product, in order to let you fully understand the product content, this 'Purchase Instructions' is provided. If you choose to participate in the purchase of this product, it is deemed that you have carefully read the Purchase Instructions and voluntarily assume the risk caused by the purchase of this data asset. When you purchase the products of the Center, you need to be aware in advance that the data asset products sold by the platform are tagged with related products, rights and interests by blockchain technology to confirm your rights and interests in the product.",
      "buy": "Purchase",
      "ali": "Alipay",
      "wechat": "WeChat Pay",
      "confirmPay": "Confirm payment",
      "backhome": "Return to home page",
      "success": "Payment success"
    },
    "index": {
      "all": "All",
      "goods": "Goods",
      "liveHL": "Real-time exchange rate",
      "category1": "Data Trade",
      "category2": "Art Pass",
      "category3": "Version Pass",
      "category4": "Travel Pass",
      "category5": "Finance Pass",
      "category6": "Rights Pass",
      "home": "Home",
      "mine": "Mine",
      "exchange": "Exchange Rate",
      "updateTime": "(updated after 10s)",
      "hkd": "HKD/CNY",
      "views": "views",
      "users": "users",
      "news": "News",
      "newsDetail": "Detail",
      "times": "Time",
      "navBtn": "Language"
    },
    "login": {
      "phone": "Please enter phone number",
      "code": "Please enter verification code",
      "login": "Login",
      "agree": "Have read and agree",
      "user": "User Agreement",
      "privacy": "Privacy Agreement",
      "and": "and"
    },
    "goods": {
      "list": {
        "price": "Unit price",
        "unit": "unit",
        "wait": "for sale",
        "unbuy": "Pending Sale",
        "buying": "On Sale",
        "stopbuy": "Sold Out"
      },
      "detail": {
        "goodsDetail": "Product details",
        "orderPay": "Order payment",
        "saleTime": "Sale stop time",
        "saleProgress": "Product application progress",
        "goodPrice": "Unit price of goods",
        "num": "Quantity issued",
        "shopinfor": "Quality store recommendation",
        "shortContent": "Product Description",
        "tips": "Purchase Instructions",
        "description": "Product description",
        "buyNum": "Subscription quantity",
        "tipsWord": "You are welcome to participate in the purchase of this product, in order to let you fully understand the product content, this 'Purchase Instructions' is provided. If you choose to participate in the purchase of this product, it is deemed that you have carefully read the Purchase Instructions and voluntarily assume the risk caused by the purchase of this data asset. When you purchase the products of the Center, you need to be aware in advance that the data asset products sold by the platform are tagged with related products, rights and interests by blockchain technology to confirm your rights and interests in the product.",
        "buy": "Purchase",
        "ali": "Alipay",
        "wechat": "WeChat Pay",
        "confirmPay": "Confirm payment",
        "backhome": "Return to home page",
        "success": "Payment success"
      }
    },
    "mine": {
      "mine": "My",
      "myOrder": "My subscription product",
      "invite": "Invitation",
      "myInvite": "My invite",
      "invitationIntro": "My QR code",
      "address": "Address Management",
      "about": "About us",
      "default": "Default",
      "addAddress": "Add address",
      "addressMGMT": "Address Management",
      "receiveName": "Consignee name",
      "receivePhone": "Consignee mobile phone",
      "receiveAddress": "Consignee address",
      "defaultAddress": "Default address",
      "inputAddress": "Please enter detailed address",
      "inputPhone": "Please enter phone",
      "inputName": "Please enter your name",
      "del": "Delete",
      "save": "Save",
      "tradeRule": "Trading rules",
      "chargeRule": "Charging rules",
      "memberRule": "Member Rule",
      "privacyRule": "Privacy Policy",
      "userAgreement": "User Agreement",
      "invitedPeople": "My invite",
      "inviteDetail": "detail>",
      "people": "People",
      "cumulativeInvitations": "Cumulative invitations",
      "noMore": "No more data",
      "invitee": "Invitee",
      "registrationDate": "Registration Date"
    },
    "order": {
      "pay": "Actual payment",
      "confirm": "Confirm receipt",
      "askget": "Request for delivery",
      "orderNo": "Order number",
      "orderTime": "Order time",
      "getInfo": "Receiving information",
      "getAddress": "Shipping address",
      "getTime": "Request for delivery time",
      "tiInfo": "Delivery information",
      "tiTime": "Pick-up time",
      "choseAdd": "Select address",
      "tiTips": "Delivery Instructions (50 words or less)",
      "input": "Fill in special instructions and requirements",
      "submit": "Submit",
      "unget": "To be picked up",
      "unPay": "To be paid",
      "unsend": "To be sent",
      "sended": "Shipped",
      "done": "Done",
      "Logistics": "Logistics information",
      "detail": "Order details",
      "bankPay": "Bank transfer",
      "wechatPay": "WeChat payment",
      "payMethod": "Payment method"
    },
    "common": {
      "nodata": "No data yet",
      "out": "Exit safely",
      "choseAdd": "Please select an address",
      "success": "Operation success",
      "delsuccess": "Delete successfully",
      "tipName": "Please enter your name",
      "tipPhone": "Please enter phone number",
      "tipAdd": "Please enter full address",
      "soon": "Available later",
      "getCode": "Get code",
      "inputCode": "Please enter verification code",
      "gou": "Please tick Yes",
      "reGet": "Reget code",
      "tipNum": "Please enter quantity",
      "tipTopNum": "Exceeds the quantity available for purchase",
      "tipLogin": "Please go to login",
      "loading": "Loading...",
      "copied": "Copied",
      "saving": "Saving...",
      "saved": "Saved",
      "saveFailed": "Save failed",
      "login": "Please login first",
      "loadFailed": "Load failed",
      "networkError": "Network request failed",
      "requestFailed": "Request failed",
      "contactManager": "Please contact customer manager"
    },
    "navigationBarTitles": {
      "pages.index.index": "HiArts",
      "pages.login.index": "Login On",
      "pages.goods.list": "Products",
      "pages.goods.detail": "Product Details",
      "pages.goods.typeList": "Products",
      "pages.goods.pay": "Place Order",
      "pages.goods.payIndex": "Payment Center",
      "pages.mine.index": "My Profile",
      "pages.mine.settings": "Settings",
      "pages.mine.privacy": "Privacy Policy",
      "pages.mine.orderList": "My Orders",
      "pages.mine.orderDetail": "Order Details",
      "pages.mine.mineInvite": "My Invitations",
      "pages.mine.addressList": "Address Management",
      "pages.mine.addressForm": "Edit Address",
      "pages.mine.about": "About Us",
      "pages.mine.user": "User Agreement"
    },
    "tabBar": {
      "home": "Home",
      "goods": "Products",
      "mine": "Mine"
    },
    "chart": {
      "currency": {
        "title": "Exchange Rate Trend",
        "yAxisName": "Exchange Rate",
        "xAxisName": "Time"
      },
      "statistics": {
        "views": "Page Views",
        "users": "Total Users",
        "orders": "Total Orders"
      }
    },
    "validation": {
      "required": "This field is required",
      "phone": "Please enter a valid phone number",
      "email": "Please enter a valid email address",
      "number": "Please enter a valid number",
      "maxLength": "Maximum length exceeded",
      "minLength": "Minimum length not met"
    },
    "error": {
      "network": "Network error, please try again",
      "server": "Server error, please try again later",
      "auth": "Authentication failed",
      "permission": "No permission",
      "validation": "Validation failed",
      "unknown": "Unknown error occurred"
    }
  },
  'zh-Hant': {
    "goodsDetail": {
      "goodsDetail": "商品詳情",
      "orderPay": "訂單支付",
      "saleTime": "發售停止時間",
      "saleProgress": "商品申購進度",
      "goodPrice": "商品單價",
      "num": "發行數量",
      "unit": "份",
      "shopinfor": "優質店鋪推薦",
      "shotContent": "商品簡介",
      "tips": "申購須知",
      "description": "商品描述",
      "buyNum": "申購數量",
      "tipsWord": "歡迎您參與購買本產品，為了讓您充分了解產品內容，特提供本《購買須知》。若您選擇參與本產品購買，則視為您已仔細閱讀本《購買須知》並自願承擔購買本數據資產所帶來的風險。在您購買本中心產品時需提前知悉，本平臺所發售的數據資產產品是以區塊鏈技術將相關產品、權益等資產上鏈標記，以確認您對該產品的權益。本平臺產品定價體系由項目底層資產價值評估構成，客戶決定購買即表示認同產品定價標準；本平臺產品僅在「合交所管理節點交易所「線上發售並結算。本平臺僅對產品進行形式審核，公示相關項目資料，客戶需自行與本產品運營機構及合作機構咨詢產品信息，並自主決定購買。鑒於您對本產品的購買意向，您需考慮自身情況是否適合進行此類產品的購買，客觀理性地認識到此類產品的風險",
      "buy": "申購",
      "ali": "支付寶",
      "wechat": "微信支付",
      "confirmPay": "確認支付",
      "backhome": "返回首頁",
      "success": "支付成功"
    },
    "index": {
      "all": "全部",
      "goods": "推薦商品",
      "liveHL": "實時匯率",
      "category1": "數貿通",
      "category2": "數藝通",
      "category3": "數版通",
      "category4": "數旅通",
      "category5": "數融通",
      "category6": "數權通",
      "home": "首頁",
      "mine": "我的",
      "exchange": "實時匯率",
      "updateTime": "（10s后自動更新）",
      "hkd": "港幣/人民幣",
      "views": "瀏覽量(次)",
      "users": "會員數(人)",
      "news": "動態",
      "newsDetail": "動態詳情",
      "times": "發佈日期",
      "navBtn": "繁/英轉換"
    },
    "login": {
      "phone": "請輸入手機號",
      "code": "請輸入驗證碼",
      "login": "登錄",
      "agree": "已閱讀并同意",
      "user": "用戶協議",
      "privacy": "隱私協議",
      "and": "和"
    },
    "goods": {
      "list": {
        "price": "單價",
        "unit": "份",
        "wait": "待售",
        "unbuy": "待審購",
        "buying": "審購中",
        "stopbuy": "停止審購"
      },
      "detail": {
        "goodsDetail": "商品詳情",
        "orderPay": "訂單支付",
        "saleTime": "發售停止時間",
        "saleProgress": "商品申購進度",
        "goodPrice": "商品單價",
        "num": "發行數量",
        "shopinfor": "優質店鋪推薦",
        "shortContent": "商品簡介",
        "tips": "申購須知",
        "description": "商品描述",
        "buyNum": "申購數量",
        "tipsWord": "歡迎您參與購買本產品...",
        "buy": "申購",
        "ali": "支付寶",
        "wechat": "微信支付",
        "confirmPay": "確認支付",
        "backhome": "返回首頁",
        "success": "支付成功"
      }
    },
    "mine": {
      "mine": "我的",
      "myOrder": "我的申購產品",
      "invite": "邀請好友",
      "myInvite": "我邀請的用戶",
      "invitationIntro": "我的二維碼",
      "address": "地址管理",
      "about": "關於我們",
      "default": "默認",
      "addAddress": "新增地址",
      "addressMGMT": "地址管理",
      "receiveName": "收貨人姓名",
      "receivePhone": "收貨人手機",
      "receiveAddress": "收貨人地址",
      "defaultAddress": "默認地址",
      "inputAddress": "請輸入詳細地址",
      "inputPhone": "請輸入手機",
      "inputName": "請輸入姓名",
      "del": "刪除",
      "save": "保存",
      "tradeRule": "交易規則",
      "chargeRule": "收費規則",
      "memberRule": "會員規則",
      "privacyRule": "隱私條款",
      "userAgreement": "用戶協議",
      "invitedPeople": "我已累計邀請用戶",
      "inviteDetail": "詳情>",
      "people": "人",
      "cumulativeInvitations": "纍計邀請",
      "noMore": "暫無更多數據",
      "invitee": "被邀請人",
      "registrationDate": "註冊日期"
    },
    "order": {
      "pay": "實付款",
      "confirm": "確認收貨",
      "askget": "申請提貨",
      "orderNo": "訂單編號",
      "orderTime": "下單時間",
      "getInfo": "收貨信息",
      "getAddress": "收貨地址",
      "getTime": "申請提貨時間",
      "tiInfo": "提貨信息",
      "tiTime": "提貨時間",
      "choseAdd": "選擇地址",
      "tiTips": "提貨説明（50字以内）",
      "input": "填寫特殊説明事項和要求",
      "submit": "提交",
      "unget": "待提貨",
      "unPay": "待支付",
      "unsend": "待發貨",
      "sended": "已發貨",
      "done": "已完成",
      "Logistics": "物流信息",
      "detail": "訂單詳情",
      "bankPay": "網銀轉賬",
      "wechatPay": "微信付款",
      "payMethod": "付款方式"
    },
    "common": {
      "nodata": "暫無數據",
      "out": "安全退出",
      "choseAdd": "請選擇地址",
      "success": "操作成功",
      "delsuccess": "刪除成功",
      "tipName": "請輸入姓名",
      "tipPhone": "請輸入手機號",
      "tipAdd": "請輸入完整地址",
      "soon": "稍後開放",
      "getCode": "獲取驗證碼",
      "inputCode": "請輸入驗證碼",
      "gou": "請勾選同意",
      "reGet": "重新獲取",
      "tipNum": "請輸入數量",
      "tipTopNum": "超過可購買數量",
      "tipLogin": "請去登錄",
      "loading": "加載中...",
      "copied": "已複製",
      "saving": "保存中...",
      "saved": "已保存",
      "saveFailed": "保存失敗",
      "login": "請先登錄",
      "loadFailed": "加載失敗",
      "networkError": "網絡請求失敗",
      "requestFailed": "請求失敗",
      "contactManager": "請聯繫客戶經理"
    },
    "navigationBarTitles": {
      "pages.index.index": "港藝",
      "pages.login.index": "登錄",
      "pages.goods.list": "商品列表",
      "pages.goods.detail": "商品詳情",
      "pages.goods.typeList": "商品列表",
      "pages.goods.pay": "商品下單",
      "pages.goods.payIndex": "支付中心",
      "pages.mine.index": "個人中心",
      "pages.mine.settings": "設置",
      "pages.mine.privacy": "隱私政策",
      "pages.mine.orderList": "我的訂單",
      "pages.mine.orderDetail": "訂單詳情",
      "pages.mine.mineInvite": "我的邀請",
      "pages.mine.addressList": "地址管理",
      "pages.mine.addressForm": "編輯地址",
      "pages.mine.about": "關於我們",
      "pages.mine.user": "用戶協議"
    },
    "tabBar": {
      "home": "首頁",
      "goods": "商品",
      "mine": "我的"
    },
    "components": {
      "navigationBar": {
        "back": "返回",
        "home": "首頁",
        "loading": "加載中"
      },
      "empty": {
        "noData": "暫無數據",
        "tryAgain": "重試"
      },
      "loading": {
        "loading": "加載中...",
        "wait": "請稍候"
      }
    },
    "chart": {
      "currency": {
        "title": "匯率走勢",
        "yAxisName": "匯率",
        "xAxisName": "時間"
      },
      "statistics": {
        "views": "頁面瀏覽",
        "users": "總用戶數",
        "orders": "總訂單數"
      }
    },
    "validation": {
      "required": "此欄位為必填",
      "phone": "請輸入有效的手機號碼",
      "email": "請輸入有效的電子郵件",
      "number": "請輸入有效的數字",
      "maxLength": "超出最大長度",
      "minLength": "未達到最小長度"
    },
    "error": {
      "network": "網絡錯誤，請重試",
      "server": "服務器錯誤，請稍後重試",
      "auth": "認證失敗",
      "permission": "無權限",
      "validation": "驗證失敗",
      "unknown": "發生未知錯誤"
    }
  }
}

function t(key, locale) {
  const currentLocale = locale || wx.getStorageSync('locale') || 'zh-Hant'
  const keys = key.split('.')
  let value = translations[currentLocale]

  for (const k of keys) {
    if (!value) break
    value = value[k]
  }

  return value || key
}

// 获取当前页面路径对应的标题key
const getPageTitleKey = (pagePath) => {
  // 处理分包路径
  if (pagePath.startsWith('packageMine/pages/')) {
    // 将 packageMine/pages/xxx/index/index 转换为 pages.mine.xxx
    const parts = pagePath.split('/')
    return `pages.mine.${parts[2]}`
  } else if (pagePath.startsWith('packageGoods/pages/')) {
    // 将 packageGoods/pages/xxx/index/index 转换为 pages.goods.xxx
    const parts = pagePath.split('/')
    return `pages.goods.${parts[2]}`
  }
  
  // 处理主包路径
  return pagePath.replace(/^\//, '.').replace(/\//g, '.')
}

// 获取当前语言
const getCurrentLanguage = () => {
  return wx.getStorageSync('locale') || 'zh-Hant';
};

// 更新导航栏标题
const updateNavigationBarTitle = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    const titleKey = getPageTitleKey(route);
    const currentLang = getCurrentLanguage();
    const title = translations[currentLang]?.navigationBarTitles?.[titleKey];
    
    console.log("[Navigation] Current route:" + route 
      + " Current language:" + currentLang 
      + " Found title:" + title);
    
    if (title) {
      wx.setNavigationBarTitle({
        title: title
      });
    }
  }
};

module.exports = {
  t: t,
  updateNavigationBarTitle,
  getPageTitleKey,
  getCurrentLanguage
}
