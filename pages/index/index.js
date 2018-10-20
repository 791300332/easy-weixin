//index.js
//获取应用实例
const app = getApp()
var common = require('../../utils/api.js')

Page({
  data: {
    userInfo: {},
    lxkf: "/images/lxkf.png",
    dtk: "/images/dtk.png",
    gwc: "/images/gwc.png",
    phb: "/images/phb.png",
    userLevel: app.globalData.userLevel,
    canIUse:wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo:false
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res)
        this.setData({
          userInfo: res.result,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    common.post("/user/miniapp/getInfo").then(res =>{
      getApp().globalData.userInfo = res.userInfo
      if (getApp().userInfoReadyCallback) {
        getApp().userInfoReadyCallback(res)
      }
    })
  },
  btnDtk:function(){
    wx.navigateTo({
      url: '/pages/question/question'
    });
  }
})
