//app.js
var common = require('/utils/api.js')

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        common.post('/user/miniapp/login',{ wxOauthCode: res.code }).then(res=>{
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    common.post('/user/miniapp/updateInfo', res.userInfo)
                    common.post('/user/miniapp/getInfo',{}).then(res =>{
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      getApp().globalData.userInfo = res.userInfo
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }
                    })
                  }
                })
              } else {
                getApp().globalData.hasScope = false;
              }
            }
          }) 
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})