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
    phb: "/images/ryphb.png",
    canIUse:wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo:false,
    notices:[]
  },
  onShow: function () {
    let that = this;
    common.post("/user/miniapp/getInfo").then(res => {
      getApp().globalData.userInfo = res.result
      if (getApp().userInfoReadyCallback) {
        getApp().userInfoReadyCallback(res)
      }
    });
    common.post("/index/notice",{}).then(res=>{
      that.setData({
        notices:res.result
      });
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: (app.globalData.userInfo.nickName != null && app.globalData.userInfo.nickName.nickName != '')? true:false
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.result,
          hasUserInfo: (res.result.nickName != null && res.result.nickName != '') ? true : false
        })
      }
    }
  },
  getUserInfo: function (e) {
    common.post('/user/miniapp/updateInfo', e.detail.userInfo)
    common.post("/user/miniapp/getInfo").then(res =>{
      app.globalData.userInfo = res.userInfo
      if (getApp().userInfoReadyCallback) {
        getApp().userInfoReadyCallback(res)
      }
    })
  },
  btnDtk:function(){
    wx.navigateTo({
      url: '/pages/question/question'
    });
  },
  btnPhb:function(){
    wx.navigateTo({
      url: '/pages/ranking/ranking'
    });
  },
  btnGwc:function(){
    wx.showToast({
      icon:'loading',
      title: '正在建设中。。。',
    });
  }
})
