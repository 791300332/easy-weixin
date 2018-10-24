// pages/wolf/wolf.js
var common = require('../../utils/api.js')
Page({
  data: {
    list:[],
    room:null,
    needAdd:[],
    hasJoin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    common.post('/wolf/kill/hasJoin', {}).then(res => {
      let isJoin = res.result;
      if (!isJoin) {
        common.post('/wolf/kill/list',{}).then(res => {
          that.setData({
            list:res.result,
            hasJoin:isJoin
          })
        })
      } else {
        common.post('/wolf/kill/room',{}).then(res =>{
          var needNum = res.result.needTotalNum - res.result.hasNum;
          var temp = [];
          for(var i = 0;i<needNum;i++) {
            temp.push(i);
          }
          console.log(temp);
          that.setData({
            room:res.result,
            hasJoin:isJoin,
            needAdd:temp
          })
        });
      }
    })
  },

  btnJoin:function(e) {
    let that = this;
    common.post("/wolf/kill/join",{roomId:e.target.id}).then(res =>{
      that.onShow();
    })
  },

  btnLeft:function(e) {
    let that = this;
    common.post('/wolf/kill/left',{}).then(res =>{
      that.onShow();
    }) 
  },

  btnYq:function(e) {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this;
    var url = '/pages/wolf/wolf' + (e.from=='button'?('?id=' + this.data.room.roomId):'');
    var shareObj = {
      title: '饭桌狼人杀，不需带牌，随时随地浪起来',
      path: '/pages/wolf/wolf',
      success: function (res) {
        
      },
      fail: function (res) {
        
      }
    }
    return shareObj;
  }
})