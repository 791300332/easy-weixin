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
    }]
  },
  onLoad:function() {
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
        answer:btnArray
      })
    });
  },
  btnList:function(e){
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
        this.onLoad();
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