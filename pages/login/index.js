var common = require('../../utils/properties.js')

Page({
  data: { 
    userKey: '', 
    userType: 0, 
    mobileNumber:'',
    code:'',
    time:'获取验证码',
    second:60},
  onLoad:function(obj) {
    this.setData({
      userKey:obj.userKey,
      userType:obj.userType
    })
  },
  phoneInp:function(e) {
    this.setData({
      mobileNumber:e.detail.value
    })
  },
  codeInp:function(e) {
    this.setData({
      code:e.detail.value
    })
  },
  codeBtn:function(e){
    if(this.data.time == '获取验证码') {
      this.setTime(this);
    }
  },
  setTime:function(obj) {
    setTimeout(function(){
      obj.setData({
        second:obj.data.second - 1
      })
      if(obj.data.second > 0) {
        var c = obj.setTime(obj);
        obj.setData({
          time:obj.data.second
        })
      } else {
        obj.setData({
          second:60,
          time:'获取验证码'
        })
      }
    },1000)
  },
  loginBtn:function(){
    if (!common.isNotNull(this.data.mobileNumber,'手机号')) return;
    if (!common.isNotNull(this.data.code, '验证码')) return;
    common.requestPost({
      url:'/user/login',
      data:this.data,
      success:function(e){
        if(getCurrentPages().length > 1) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  }
})