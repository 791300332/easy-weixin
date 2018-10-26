const ctx2 = wx.createCanvasContext("bgCanvas");//创建id为bgCanvas的背景绘图
var mytime;//跑马灯定时器名称
var lamp = 0; //判断跑马灯闪烁标记
var w2 = "";
var h2 = "";
//获取应用实例
const app = getApp()
var common = require('../../utils/api.js')

Page({
  //奖品配置
  awardsConfig: {
    chance: true,
    awards: [
      { 'index': 0, 'name': '谢谢参与' },
      { 'index': 1, 'name': '10积分' },
      { 'index': 2, 'name': '20积分' },
      { 'index': 3, 'name': '50积分' },
      { 'index': 4, 'name': '100积分' },
      { 'index': 5, 'name': '666积分' }
    ]
  },

  /**
   * 页面的初始数据
   */
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    userInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    color: ["#FFB932", "#ffd57c"],//扇形的背景颜色交替；
    text: ["666积分", "100积分", "50积分", "20积分", "10积分", "谢谢参与"],//每个扇形中的文字填充
  },
  onShow:function(){
    wx.setNavigationBarTitle({
      title: '首页',
    })
    common.post("/user/miniapp/getInfo").then(res => {
      getApp().globalData.userInfo = res.result
      if (getApp().userInfoReadyCallback) {
        getApp().userInfoReadyCallback(res)
      }
    })
  },
  onReady:function(){
    let that = this;
    this.drawAwardRoundel();
    wx.createSelectorQuery().select('#canvas-bg').boundingClientRect(function (rect) {//监听canvas的宽高
      w2 = parseInt(350 / 2);//获取canvas宽度的一半；
      h2 = parseInt(350 / 2);//获取canvas高度的一半
      console.log(w2, h2); //获取canvas宽高一半的原因是为了便于找到中心点
      that.light();
    }).exec();
    mytime = setInterval(that.light, 1000);//启动跑马灯定时器。
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    common.post("/user/miniapp/getInfo").then(res => {
       that.setData({
         userInfo: res.result,
         hasUserInfo: (res.result.nickName != null && res.result.nickName != '')?true:false
       }, function () {
        //  wx.createSelectorQuery().select('#canvas-bg').boundingClientRect(function (rect) {//监听canvas的宽高
        //    w2 = parseInt(rect.width / 2);//获取canvas宽度的一半；
        //    h2 = parseInt(rect.height / 2);//获取canvas高度的一半
        //    console.log(w2, h2); //获取canvas宽高一半的原因是为了便于找到中心点
        //    that.light();
        //  }).exec();
        //  mytime = setInterval(that.light, 500);//启动跑马灯定时器。
       })
    });
  },
  //画抽奖圆盘
  drawAwardRoundel: function () {
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length;  // 文字旋转 turn 值

    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awards[i].name });
    }

    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList
    });
  },

  //发起抽奖
  playReward: function () {
    let that = this;
    common.post("/user/award/start", {}).then(res =>{
      console.log(res);
      //中奖index
      var awardIndex = 6 - parseInt(res.result);
      var runNum = 8;//旋转8周
      var duration = 4000;//时长

      // 旋转角度
      that.runDeg = that.runDeg || 0;
      that.runDeg = that.runDeg + (360 - that.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))
      //创建动画
      var animationRun = wx.createAnimation({
        duration: duration,
        timingFunction: 'ease'
      })
      animationRun.rotate(this.runDeg).step();
      that.setData({
        animationData: animationRun.export(),
        btnDisabled: 'disabled'
      });

      // 中奖提示
      var awardsConfig = that.awardsConfig;
      setTimeout(function () {
        wx.showModal({
          title: awardIndex != 0?'恭喜':'非常遗憾',
          content: (awardIndex != 0 ?'获得':'') + (awardsConfig.awards[awardIndex].name),
          showCancel: false
        });
        common.post("/user/miniapp/getInfo",{}).then(res =>{
          that.setData({
            btnDisabled: '',
            userInfo:res.result
          });
        })
        
      }.bind(that), duration);
    }).catch( function (reason, data) {
      console.log(data);
    })
  },
  light() { //跑马灯的绘制
    let that = this;
    let itemsNum = this.awardsConfig.awards.length;
    lamp++;
    if (lamp >= 2) {
      lamp = 0
    }
    // ctx2.beginPath();
    // ctx2.arc(w2, h2, w2, 0, 2 * Math.PI);//绘制底色为红色的圆形
    // ctx2.setFillStyle("#DF1E14");
    // ctx2.fill();
    // ctx2.beginPath();
    // ctx2.arc(w2, h2, w2 - 15, 0, 2 * Math.PI);//绘制底色为深黄的圆形
    // ctx2.setFillStyle("#F5AD26");
    // ctx2.fill();
    for (let i = 0; i < itemsNum * 2; i++) {//跑马灯小圆圈比大圆盘等分数量多一倍。
      ctx2.save();
      ctx2.beginPath();
      ctx2.translate(w2, h2);
      ctx2.rotate(30 * i * Math.PI / 180);
      ctx2.arc(0, w2 - 15, 8, 0, 2 * Math.PI);//绘制坐标为(0,-135)的圆形跑马灯小圆圈。
      //跑马灯第一次闪烁时与第二次闪烁时绘制相反的颜色，再配上定时器循环闪烁就可以达到跑马灯一闪一闪的效果了。

      if (lamp == 0) { //第一次闪烁时偶数奇数的跑马灯各绘制一种颜色
        if (i % 2 == 0) {
          ctx2.setFillStyle("#FBF1A9");
        } else {
          ctx2.setFillStyle("#fbb936");
        }
      } else { //第二次闪烁时偶数奇数的跑马灯颜色对调。
        if (i % 2 == 0) {
          ctx2.setFillStyle("#fbb936");
        } else {
          ctx2.setFillStyle("#FBF1A9");
        }
      }
      ctx2.fill();
      ctx2.restore();//恢复之前保存的上下文，可以将循环出来的跑马灯都保存下来。没有这一句那么每循环出一个跑马灯则上一个跑马灯绘图将被覆盖，
    }
    ctx2.draw();

  },
  getUserInfo: function (e) {
    common.post('/user/miniapp/updateInfo', e.detail.userInfo)
    common.post("/user/miniapp/getInfo").then(res => {
      app.globalData.userInfo = res.userInfo
      if (getApp().userInfoReadyCallback) {
        getApp().userInfoReadyCallback(res)
      }
    })
  },
  btnSign:function() {
    let that = this;
    common.post("/user/miniapp/sgin",{}).then(res =>{
      common.post("/user/miniapp/getInfo",{}).then(res =>{
        that.setData({
          userInfo:res.result
        })
      })
    })
  }
})
