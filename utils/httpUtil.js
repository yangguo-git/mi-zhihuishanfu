const config = {

  // reqUrl: "https://tcheckminip.weein.cn/check",  //测试
  // reqUrlVersion: 'dev',

  reqUrl: "https://checkminip.weein.cn/check",  //线上
  reqUrlVersion: 'online',

  envVersionConfig:'release',
  navigatorMNPVersion : '2.3.0'  //navigator跳转外部小程序支持版本
}
/*
 * 展示进度条的网络请求
 * url:网络请求的url
 * params:请求参数
 * message:进度条的提示信息
 * success:成功的回调函数
 * fail：失败的回调
 */

//POST 请求
function postRequest(url, params, message, success, fail,num) {

  let infoAccess = wx.getStorageSync('infoAccess');
  let mch_id = wx.getStorageSync('mch_id');
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  };
  let contentType = 'application/json';
  if(num){
    contentType = 'application/x-www-form-urlencoded';
  }
  wx.request({
    url: config.reqUrl + url,
    data: params,
    header: {
      'INFOINSIDE':infoAccess||'',
      'Content-Type': contentType,
       mch_id:mch_id
    },
    method: 'POST',
    success: function (res) {

      if (message != "") {
        wx.hideLoading()
      }
      if (res.data.status == 20002) { // 重新登录
        wx.removeStorageSync('infoAccess')
        wx.removeStorageSync('sessionCode')
        getApp().getInfoAccess_promise().then(resolve => {
          return postRequest(url, params, message, success, fail,num);
        });
      } else {
        success(res.data);
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (fail) { fail(res)}
    },
    complete: function (res) {

    },
  })
}

//GET 请求
function getRequest(url, params, message, success, fail,num) {

  let infoAccess = wx.getStorageSync('infoAccess');
  let mch_id = wx.getStorageSync('mch_id');
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  let contentType = 'application/json';
  if(num){
    contentType = 'application/x-www-form-urlencoded';
  }
  wx.request({
    url: config.reqUrl + url,
    data: params,
    header: {
      'INFOINSIDE':infoAccess|| '',
      'content-type':contentType,
       mch_id:mch_id
    },
    method: 'GET',
    success: function (res) {
      if (message != "") {
        wx.hideLoading()
      }
      if (res.data.status == 20002) { // 重新登录
        wx.removeStorageSync('infoAccess')
        wx.removeStorageSync('sessionCode')
        getApp().getInfoAccess_promise().then(resolve => {
          return getRequest(url, params, message, success, fail,num);
        });
      } else {
        success(res.data);
      }

    },
    fail: function (res) {
      // wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail(res)
    },
    complete: function (res) {

    },
  })
}

// 封装小程序自带接口
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}


/**
 * 微信用户登录,获取code
 */
function wxLogin() {
  return wxPromisify(wx.login)
}
/**
 * 获取微信用户信息
 * 注意:须在登录之后调用
 */
function wxGetUserInfo() {
  return wxPromisify(wx.getUserInfo)
}
/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return wxPromisify(wx.getSystemInfo)
}

// 提示语
const errorTips = "网络不佳，请稍后重试";
const systemTips = "系统维护中，请稍后重试";

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  config,
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxGetSystemInfo: wxGetSystemInfo,
  errorTips: errorTips,
  systemTips: systemTips
}
