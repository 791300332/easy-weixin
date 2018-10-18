function requestGet(obj){
  wx.request({
    url: getApp().globalData.api_url + obj.url,
    data:obj.data,
    header: getApp().globalData.header,
    success:function(e){
      var data = e.data;
      var code = data.code;
      var des = data.description;
      var result = data.result;
      switch(code) {
        case '0':console.log(result);break;
        case 'WEMAILL_ACCOUNT_1127': console.log(des);break;
        default : wx.showToast(des); break;
      }
    }
  })
}

function requestPost(obj) {
  debugger
  wx.request({
    url: getApp().globalData.api_url + obj.url,
    data: obj.data,
    header: getApp().globalData.header,
    method:'POST',
    success: function (e) {
      var data = e.data;
      var code = data.code;
      var des = data.description;
      var result = data.result;
      var token = e.header['x-access-token'];
      if(token != null && token != '' && token != 'undefind') {
        getApp().globalData.header['x-access-token'] = token;
      }
        
      switch (code) {
        case '0': obj.success(result); break;
        case 'WEMAILL_ACCOUNT_1127': 
          var data = JSON.parse(des.replace(/\ufeff/g, ""));
          wx.redirectTo({
            url: '/pages/login/index?' + "userKey=" + data.userKey + "&userType=" + data.wxUserType 
          }); break;
        default: wx.showToast({
          title:des,
          icon:'none'
        }); break;
      }
    }
  })
}

function isNotNull(field,fieldName){
  if(field == '' || field == null || field == 'undefind') {
    wx.showToast({
      title: fieldName + '不能为空',
      icon:'none'
    });
    return false;
  }
  return true;
}

module.exports = {
  requestGet: requestGet,
  requestPost: requestPost,
  isNotNull: isNotNull
}

