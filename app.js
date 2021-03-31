// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let that = this;
    wx.getSystemInfo({
      success: (result) => {
        that.globalData.width = result.windowWidth;
        that.globalData.height = result.windowHeight;
      },
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    width:0,
    height:0
  }
})
