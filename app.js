const httpUtil = require('./utils/httpUtil.js');
App({
  onLaunch: function (options) {
  },
  onShow:function(options){
    console.log('appjsonshow',options)
  },
  getInfoAccess_promise() {
    return new Promise(rr => {
      wx.login({
        success: (res) => {
          var re_login_fc = () => {
            let mch_id = wx.getStorageSync('mch_id');
            httpUtil.postRequest('/minip/login', {
              code: res.code,
              mch_id:mch_id
            }, '', function (res) {
              if (res.status == 0) {
                if (res.data.infoInside == "") {
                  rr(false)
                } else {
                  wx.setStorageSync('infoAccess', res.data.infoInside);
                  rr(true)
                }
              }

            }, function (err) {

            }, 1)
          }
          re_login_fc()
        }
      })
    })
  },
  globalData: {
    userInfo: null
  }
})