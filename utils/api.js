const baseURL = 'https://www.jiachao.online'
const header = {
  'Content-Type': 'application/json',
  'Accept': '*/*',
  'x-access-origin': 'WECHATMINIAPP',
  'x-access-token': ''
}
const http = ({url = '',params = {},...other} = {}) =>{
  wx.showLoading({
    title: '加载中',
  })
  let time = Date.now()
  console.log(`开始:${time}`)
  return new Promise((resolve,reject)=>{
    wx.request({
      url: getUrl(url),
      data:params,
      header:getHeader(),
      ...other,
      complete:(res) =>{
        wx.hideLoading()
        console.log(`耗时:${Date.now() - time}`);
        console.log(res);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.header['x-access-token']) {
            wx.setStorageSync('x-access-token', res.header['x-access-token'])
          }
          var code = res.data.code;
          if( code == 0) {
            resolve(res.data)
          } else if ("F_WEBKITS_SECURITY_1003" == code) {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          } else {
            wx.showToast({
              title: res.data.description,
              icon: 'none'
            })
            reject(res);
          }
        } else {
          reject(res)
        }
      }
    })
  })
}

const getUrl = url =>{
  if(url.indexOf('://') == -1) {
    url = baseURL + url;
  }
  return url;
}

const getHeader = () =>{
  try{
    var token = wx.getStorageSync("x-access-token");
    if(token) {
      header['x-access-token'] = token;
    } else {
      header['x-access-token'] = '';
    }
  } catch(e) {

  }
  return header;
}

module.exports = {
  baseURL,
  get(url,params = {}) {
    return http({
      url,params
    })
  },
  post(url,params = {}) {
    return http({
      url,params,
      method:'post'
    })
  }
}