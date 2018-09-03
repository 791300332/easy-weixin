//app.js
var common = require('/utils/properties.js')

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        common.requestPost({
          url:'/user/miniapp/login',
          data: { wxOauthCode: res.code },
          success:function(e){
            
          }
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    api_url: 'https://www.jiachao.online',
    header: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'x-access-origin': 'WECHATMINIAPP',
      'x-access-token': ''
    },
    userInfo: null
  }
})