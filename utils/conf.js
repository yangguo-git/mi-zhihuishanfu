const api = require('../utils/api.js');
var conf = {baseUrl: api.baseUrl}
const getHeader = (num) => {
  let infoAccess = wx.getStorageSync('infoAccess');
  if(num){
      return {
        'content-type': "application/json",
        'INFOINSIDE':infoAccess||''
      };
  }

  return {
    'content-type': 'application/x-www-form-urlencoded',
    'INFOINSIDE':infoAccess||''
  };
  
}
const formatPrice = (price, unit) => {
  const p = typeof price !== 'number' ? parseInt(price, 10) : price;
  return unit ? (p / 100).toFixed(2) : p.toFixed(2);
}

module.exports = {
  baseUrl: conf.baseUrl,
  getHeader: getHeader,
  formatPrice: formatPrice,
  //form表单事件
  formSubmit: function(options) {
    wx.request({
      url: conf.baseUrl + "/v1/invoice/saveFormid.do",
      method: 'POST',
      data: {
        ...options,
        session: wx.getStorageSync('sessionCode'),
      },
      header: getHeader(),
      success: function(res) {
        if (res.statusCode == 200) {

        }
      }
    })
  },

  saveJumpRecord: function(options) {
    wx.request({
      url: api.saveJumpRecord(),
      method: 'POST',
      data: {
        ...options,
        session: wx.getStorageSync('sessionCode'),
      },
      header: getHeader(),
      success: function(res) {
        if (res.statusCode == 200) {
          console.log(res)
        }
      }
    })
  },
};