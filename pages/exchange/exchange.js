var common = require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    awards: []
  },
  onLoad: function () {
    let that = this;
    common.post('/award/list',{}).then(res =>{
      that.setData({
        awards:res.result
      });
    })
  }
})