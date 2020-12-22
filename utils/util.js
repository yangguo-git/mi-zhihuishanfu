const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//修改优惠券显示格式及条件
export function formatCouponsCard(option) {
  option.forEach(res => {
    res.vailyTime = res.vailyTime.split("至")[0] + " 至 " + res.vailyTime.split("至")[1]
    if (res.type !== "DONATE") {
      res.value = res.value.substr(0, res.value.length - 1)
    }
  })
  return option
}

export function formatCouponsCardDesc(option) {
  option.vailyTime = option.vailyTime.split("至")[0] + " 至 " + option.vailyTime.split("至")[1]
  if (option.cardType !== "DONATE") {
    option.cardValue = option.cardValue.substr(0, option.cardValue.length - 1)
  }
  option.description = JSON.parse(option.description)
  return option
}
export function formatCouponsCardAduit(option) {
  if (option.length < 1) {
    wx.showToast({
      title: '没有要审核的优惠券',
      duration: 2000,
      icon: 'none'
    });
  }
  option.forEach(res => {
    res.vailyTime = res.vailyTime.split("至")[0] + " 至 " + res.vailyTime.split("至")[1]
    if (res.cardType !== "DONATE") {
      res.cardValue = res.cardValue.substr(0, res.cardValue.length - 1)
    }
  })
  return option
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 网络请求
const request = function (url, method, data, msg, succ, fail, com) {
  // 小程序顶部显示Loading
  // wx.showNavigationBarLoading();
  if (msg != "") {
    wx.showLoading({
      title: msg
    })
  }
  wx.request({
    url: url,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: method,
    success: res => {
      console.log(url + ' 提交的data:', data);
      if (succ) succ(res);
    },
    fail: err => {
      wx.showToast({
        title: '网络错误，请稍后再试···',
        icon: 'none'
      })
      if (fail) fail(err);
    },
    complete: com => {
      // wx.hideNavigationBarLoading();
      if (msg != "") {
        wx.hideLoading();
      }
      console.log(url + ' 返回的data:', com.data);
    }
  })
}
export function getUrlParams(option) {
  const str = decodeURIComponent(option);
  const newStrArr = str.split('&');
  const obj = {};
  newStrArr.forEach((item) => {
    const itemArr = item.split('=');
    obj[itemArr[0]] = itemArr[1]
  })
  return obj;
}

//身份证号码校验
export function checkCard(code) {
  let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  let _IDre15 =  /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
  if(_IDRe18.test(code)){
    return true
  }
  return false;
  
}
//姓名
export function uesrnameEncrypt(str) {
  return str.substring(0,1) + new Array(str.length).join('*')
}
//身份证号
export function parseStringToStar(str) {
  return str.length > 2 ? str.substr(0, 2) + new Array(str.length - 2).join('*') + str.substr(-2) : str
}

export function regPhone(phone){
  var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  return reg.test(phone);
}


//时间戳转日期格式
export function getTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

export function getCurrentPageUrlWithArgs() { // /*获取当前页带参数的url*/
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  // var urlWithArgs = url + '?'
  // for(var key in options){
  //     var value = options[key]
  //     urlWithArgs += key + '=' + value + '&'
  // }
  // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)

  return options
}

export function getCurrentPageUrl() {/*获取当前页url*/
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

export function GetQueryString(name,params){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = params.match(reg);
  if(r!=null)return  decodeURIComponent(r[2]); return null;
}
// 使用示例 console.log(GetQueryString('mchId','mchId=TLNTQDquick2020&isCheck=1'))

module.exports = {
  request: request,
  formatTime: formatTime, formatCouponsCardAduit, formatCouponsCard, formatCouponsCardDesc,
  getUrlParams,
  checkCard,
  uesrnameEncrypt,
  parseStringToStar,
  regPhone,
  getTime,
  getCurrentPageUrlWithArgs,
  getCurrentPageUrl,
  GetQueryString
}
