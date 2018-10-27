// pages/wolf/wolf.js
var url = 'wss://www.jiachao.online/websocket';
var socketOpen = false;
var common = require('../../utils/api.js')
Page({
  data: {
    userInfo:{},
    list:[],
    index:0,
    fg:null,
    room:null,
    needAdd:[],
    hasJoin:false,
    modalCreate:true,
    modalJoin:true,
    modalFg:true,
    joinRoomId:null,
    socketTask:null,
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
    common.post('/user/miniapp/getInfo', {}).then(res => {
      this.setData({
        userInfo: res.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(this.listen,5000,this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(this.data.userInfo == null) {
      common.post('/user/miniapp/getInfo', {}).then(res => {
        that.data.userInfo = res.result;
        that.updateRoom(that);
      })
    } else {
      this.updateRoom(that);
    }
  },

  updateRoom:function(obj){
    console.log(obj);
    let that = obj;
    common.post('/wolf/kill/hasJoin', {}).then(res => {
      let isJoin = res.result;
      var userInfo = that.data.userInfo;
      if (!isJoin) {
        wx.setNavigationBarTitle({
          title: '杀狼人',
        })
        common.post('/wolf/kill/list', {}).then(res => {
          that.setData({
            list: res.result,
            hasJoin: isJoin,
            userInfo: userInfo,
            modalJoin:true,
            modalCreate:true,
            modalFg:true
          })
        })
      } else {
        that.updateRoomInfo(that);
      }
    })
  },

  updateRoomInfo:function(that) {
    common.post('/wolf/kill/room', {}).then(res => {
      wx.setNavigationBarTitle({
        title: '房间号:' + res.result.roomId,
      })
      that.putRoomInfo(that,res.result);
    });
  },

  putRoomInfo:function(that,res) {
    var needNum = res.needTotalNum - res.hasNum;
    var temp = [];
    for (var i = 0; i < needNum; i++) {
      temp.push(i);
    };
    if (that.data.socketTask == null) {
      var socketTask = that.webSocket();
      that.data.socketTask = socketTask;
    }
    that.setData({
      room: res,
      hasJoin: true,
      needAdd: temp,
      userInfo: that.data.userInfo,
      socketTask: that.data.socketTask
    });
  },
  webSocket: function () {
    let that = this;
    // 创建Socket
    var socketTask = wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    });
    socketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res);
    });
    socketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
    });
    socketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    });
    socketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var result = JSON.parse(onMessage.data)
      var status = result.status;
      if (status == 'none') {

      } else if (status == 'delete' && this.hasJoin) {
        this.onShow();
      } else if (status == 'update') {
        that.putRoomInfo(that, JSON.parse(result.room));
      }
    });
    return socketTask;
  },

  listen:function(obj) {
    let task = this.data.socketTask;
    if (socketOpen && this.data.room != null) {
      var str = '{"ownerId":"' + this.data.userInfo.xCardUserId + '","updateVersion":"' + this.data.room.updateVersion + '"}';
      console.log(str);
      task.send({
        data:str,
        success:function(e) {
          console.log('发送成功:',e);
        }
      })
    } else if(!socketOpen){
      task = this.webSocket();
      this.setData({
        socketTask:task
      })
    }
    setTimeout(this.listen,1000,this);
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
  btnModalFg:function(e) {
    this.setData({
      modalFg:false
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

  confirmFg : function(e) {
    this.setData({
      modalFg:true
    })
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

  cancelFg: function(e) {
    this.setData({
      modalFg:true
    })
  },

  pickerChange:function(e) {
    var index = e.detail.value;
    var selectUser = this.data.room.users[index];
    this.setData({
      fg:selectUser,
      index:index,
      modalFg:true
    })
  },

  delUser:function(e) {
    var that = this;
    var id = e.target.id;
    console.log(that);
    if(this.data.room.status == '创建') {
      wx.showModal({
        title: '踢人',
        content: '你确定要删除他吗',
        success: function (res) {
          if (res.confirm) {
            common.post('/wolf/kill/del', { xCardUserId: id }).then(res => {
              that.onShow();
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '踢人',
        content: '游戏已经开始了，不能踢人哦',
        showCancel:false
      });
    }
    
  },

  startGame: function(){
    let that = this;
    if(this.data.fg == null) {
      wx.showToast({
        title: '请指定法官',
        icon:'none'
      })
    } else {
      common.post('/wolf/kill/startGame', this.data.fg).then(res => {

      })
    }
  },

  stopGame:function(){
    common.post('/wolf/kill/stopGame', {}).then(res => {

    })
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