// pages/wolf/wolf.js
var common = require('../../utils/api.js')
Page({
  data: {
    userInfo:{},
    list:[],
    room:null,
    needAdd:[],
    hasJoin:false,
    modalCreate:true,
    modalJoin:true,
    joinRoomId:null,
    listen:false,
    timeoutNum:null,
    isHide:false,
    createInfo:{
      roomId:'',
      identifyDTO:[
        { "identify": "SEER", "num": 1, "name": "预言家"},
        { "identify": "WITCH", "num": 1, "name": "女巫" },
        { "identify": "HUNTER", "num": 1, "name": "猎人" },
        { "identify": "WOLF", "num": 4, "name": "狼人"},
        { "identify": "VILLAGER", "num": 4, "name": "村民" }
      ]
    },
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
    common.post('/user/miniapp/getInfo',{}).then(res =>{
      this.setData({
        userInfo:res.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isHide:false
    })
    this.updateRoom(this);
  },

  updateRoom:function(obj){
    if(!obj.data.isHide) {
      let that = this;
      common.post('/wolf/kill/hasJoin', {}).then(res => {
        let isJoin = res.result;
        if (!isJoin) {
          wx.setNavigationBarTitle({
            title: '杀狼人',
          })
          var tempNum = that.data.timeoutNum;
          if (tempNum != null) {
            clearTimeout(tempNum);
          }
          common.post('/wolf/kill/list', {}).then(res => {
            that.setData({
              list: res.result,
              hasJoin: isJoin,
              listen: false,
              timeoutNum: null
            })
          })
        } else {
          that.updateRoomInfo(that);
        }
      })
    }
  },

  updateRoomInfo:function(that) {
    common.post('/wolf/kill/room', {}).then(res => {
      wx.setNavigationBarTitle({
        title: '房间号:' + res.result.roomId,
      })
      var needNum = res.result.needTotalNum - res.result.hasNum;
      var temp = [];
      for (var i = 0; i < needNum; i++) {
        temp.push(i);
      }
      var tempNum = setTimeout(that.updateRoom, 5000,that);
      that.setData({
        room: res.result,
        hasJoin: true,
        needAdd: temp,
        listen: true,
        timeoutNum: tempNum
      })
    });
  },

  btnJoin:function(e) {
    let that = this;
    common.post("/wolf/kill/join",{roomId:e.target.id}).then(res =>{
      that.onShow();
    })
  },

  btnLeft:function(e) {
    let that = this;
    wx.showModal({
      title: '退出',
      content: '确定要退出吗?',
      success:function(e) {
        if(e.confirm) {
          common.post('/wolf/kill/left', {}).then(res => {
            that.onShow();
          }) 
        }
      }
    })
  },
  btnModalCreate:function(e) {
    var temp = this.data.createInfo;
    var randStr = common.randomString(4);
    temp.roomId = randStr
    this.setData({
      modalCreate:false,
      createInfo:temp
    });
  },
  btnModalJoin:function(e) {
    this.setData({
      modalJoin:false
    })
  },
  createInputChange:function(e) {
    var id = e.target.id;
    var value = e.detail.value;
    var temp = this.data.createInfo;
    for (var i = 0; i < temp.identifyDTO.length;i++) {
      var obj = temp.identifyDTO[i];
      if(obj.identify == id) {
        obj.num = value;
      }
    }
    this.setData({
      createInfo:temp
    })
  },
  confirmCreate:function(e) {
    let that = this;
    common.post('/wolf/kill/create', this.data.createInfo).then(res => {
      that.onShow();
    }).catch(e => {
      console.log(e);
    })
  },

  changeCreateRoomId:function(e) {
    var temp = this.data.createInfo;
    temp.roomId = e.detail.value;
    this.setData({
      createInfo:temp
    })
  },

  changeJoinRoomId:function(e) {
    this.setData({
      joinRoomId:e.detail.value
    })
  },

  confirmJoin:function(e) {
    var temp = this.data.joinRoomId;
    var that = this;
    if (temp == null || temp == '') {
      wx.showToast({
        title: '房间号不能为空',
      });
    }else {
      common.post('/wolf/kill/join', { roomId: temp}).then(res => {
        that.setData({
          modalJoin:true
        })
        that.onShow();
      })
    }
  },

  cancelJoin:function(e) {
    let that = this;
    that.setData({
      modalJoin: true
    });
  },

  cancelCreate:function(e) {
    let that = this;
    that.setData({
      modalCreate: true
    });
  },

  delUser:function(e) {
    var that = this;
    var id = e.target.id;
    wx.showModal({
      title: '踢人',
      content: '你确定要删除他吗',
      success:function(res) {
        if(res.confirm) {
          common.post('/wolf/kill/del', { xCardUserId: id }).then(res => {
            that.onShow();
          })
        }
      }
    })
  },

  startGame: function(){
    let that = this;
    common.post('/wolf/kill/startGame',{}).then(res =>{
      that.updateRoom();
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isHide:true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.btnLeft();
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
      imageUrl:'/images/WOLF.png',
      success: function (res) {
        
      },
      fail: function (res) {
        
      }
    }
    return shareObj;
  }
})