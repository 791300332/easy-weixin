//获取应用实例
const app = getApp()
var common = require('../../utils/api.js')

Page({
  data:{
    phbList:[],
    url:"/images/wzry.png",
    defaultUrl:"/images/mrtx.png",
    currentPage:0,
    isLast:false
  },
  onShow:function() {
    
  },
  onLoad:function(){
    if(!this.data.isLast) {
      var tempPage = this.data.currentPage + 1;
      common.post("/user/miniapp/phb", {currentPage:tempPage}).then(res => {
        console.log(res);
        console.log(this);
        var temp = [];
        for(var i = 0;i<res.result.list.length;i++) {
          temp.push(res.result.list[i]);
        }
        if(this.data.currentPage == res.result.totalPage) {
          this.setData({
            isLast:true
          });
        }
        this.setData({
          phbList:temp,
          currentPage:res.result.currentPage
        })
      }).catch(res => {
        console.log(res);
      })
    }
  }
})