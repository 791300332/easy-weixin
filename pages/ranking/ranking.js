//获取应用实例
const app = getApp()
var common = require('../../utils/api.js')

Page({
  data:{
    phbList:[],
    url:"/images/wzry.png",
    defaultUrl:"/images/mrtx.png",
    currentPage:0,
    pageSize: 10,
    isLast:false
  },
  onShow:function() {
    
  },
  onLoad:function(){
    let that = this;
    this.handleData(that);
  },
  onReachBottom:function(){
    let that = this;
    this.handleData(that);
  },
  handleData:function(obj) {
    if (!obj.data.isLast) {
      var tempPage = this.data.currentPage + 1;
      common.post("/user/miniapp/phb", { currentPage: tempPage, pageSize: obj.data.pageSize }).then(res => {
        var temp = obj.data.phbList;
        for (var i = 0; i < res.result.list.length; i++) {
          temp.push(res.result.list[i]);
        }
        obj.setData({
          phbList: temp,
          currentPage: res.result.currentPage,
          isLast: res.result.currentPage == res.result.pageCount
        })
      }).catch(res => {
      })
    }
  }
})