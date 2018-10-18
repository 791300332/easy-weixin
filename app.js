//app.js
var common = require('/utils/properties.js')

App({
  globalData:{
    userInfo:{}
  },
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        common.requestPost({
          url:'/user/miniapp/login',
          data: { wxOauthCode: res.code },
          success:function(e){
            console.log(e);
          }
        });
      }
    })
  }
})