//index.js
//获取应用实例
const app = getApp()
var common = require('../../utils/api.js')
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    question:{},
    answer:[{
      id:"",
      value:""
    }],
    hasShare:false,
    lookAnswer:null
  },
  onShareAppMessage:function(options) {
    var that = this;
    var shareObj = {
      title: '快来解题赚积分换礼品',
      success:function(res) {
        if(res.errMsg == 'shareAppMessage:ok') {
          common.post('/user/question/look/answer',{id:that.data.question.id}).then(res => {
            that.setData({
              hasShare:true,
              lookAnswer:res.result
            })
          });
        }
      },
      fail: function(res) {
        console.log(res);
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '您取消了分享',
          });
        } else if (res.errMsg == 'shareAppMessage:fail') {
          wx.showToast({
            title: '分享失败',
          });
        }
      }
    }

    return shareObj;
  },
  onLoad:function(obj) {
    common.post("/user/question/start").then(res =>{
      var article = res.result.content;
      var that = this;
      WxParse.wxParse('article', 'html', article, that, 5);

      var btnArray = [];
      for (var i = 0; i < res.result.answerWordsNum;i++) {
        btnArray.push({id:i,value:""});
      }
      this.setData({
        question: res.result,
        answer:btnArray,
        hasShare:false,
        lookAnswer:null
      });
      if(obj!=null && obj != undefined) {
        if(obj == true) {
          wx.showToast({
            title: '+10',
            image: '/images/jf.png'
          })
        }
      }
    });
  },
  btnList:function(e){
    let that = this;
    var temp = this.data.answer;
    var i = 0;
    for (i; i < temp.length; i++) {
      if (temp[i].value == "") {
        temp[i].value = e.target.id;
        break;
      }
    }
    this.setData({
      answer:temp
    })
    var answerStr = "";
    for(i = 0;i < temp.length;i++) {
      if(temp[i].value == "") {
        break;
      }
      answerStr += temp[i].value;
    }
    if(i == temp.length) {
      common.post("/user/question/answer", { questionId: this.data.question.id, answer: answerStr }).then(res => {
        wx.showToast({
          title: '+10',
          image: '/images/jf.png'
        });
        that.onLoad(true);
      })
    }
  },
  btnAnswer:function(e){
    var id = e.target.id;
    var temp = this.data.answer;
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].id == id) {
        temp[i].value = "";
        break;
      }
    }
    this.setData({
      answer:temp
    })
  }
})