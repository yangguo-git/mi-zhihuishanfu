const app = getApp()
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');

var httpUtil = require('../../utils/httpUtil.js');

Page({
  data: {
    userInfo: {},
    phoneNumber: '',
    channelid: '',
    mch_id:''
  },
  onLoad: function (options) {
    console.log("options6",options);
    const {q} = options;
    if (q) {
      let urlStr = decodeURIComponent(q);
      console.log('urlStr',urlStr)
      if (urlStr.indexOf("?") != -1) {
        let params = urlStr.split("?")[1];
        let urlParams = params.split("=")[1];
        if(urlParams){
          wx.setStorageSync('mch_id',urlParams);
          this.setData({
            mch_id:urlParams
          })
          this.getResult(urlParams)//先查询用户是否注册过this.originloginRequest(urlParams);
        }

      }
    }else{
      let mchId = wx.getStorageSync('mch_id');
      console.log("HCmchId",mchId);
      if(mchId){
        this.getResult(mchId)//先查询用户是否注册过
      }

    }
   
  },
  onShow:function(){
    
  },
  getResult(urlParams){
    let that = this;
    httpUtil.getRequest('/face/qry', {
      mch_id:urlParams
    }, '', function (res) {
      console.log('qry',res)
      if (res.data.userName && res.data.idCard && res.data.checkStatus == 1) {
        let postObj = res.data;
        wx.reLaunch({
          url: '/pages/credentials/credentials?obj='+JSON.stringify(postObj)
        })
      }else{
        that.originloginRequest(urlParams);
      }
    }, function (res) {
      console.log('qry/error',res)
      try {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      } catch (error) {
        console.log('qry/catcherror',error)
      }
    },1)
  },
  onShow:function(){
    
  },
  originloginRequest:function(mchId) {
    var wxLogin = httpUtil.wxLogin();
    wxLogin().then((res) => {
      let params = {
        code: res.code,
        mch_id:mchId
      };
      httpUtil.postRequest('/minip/login', params, '', function (res) {
        console.log('login',res)
        if (res.data) {
          if(res.data.infoInside){
            wx.setStorageSync('infoAccess',res.data.infoInside);
            wx.setStorageSync('sessionCode',res.data.infoInside);
          }
        }else{
          console.log('login2',res)
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }

      }, function (res) {
        console.log('login/error',res)
        try {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          })
        } catch (error) {
          console.log('login/catcherror',error)
        }
        
      }, 1)
    })
  },
  goFace() {
    wx.navigateTo({
      url: '/pages/faceLogin/faceLogin'
    })
  },
  getPhoneNumber: function (e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let params = {
        encrypt_data: e.detail.encryptedData,
        iv: e.detail.iv,
        mch_id:that.data.mch_id
      }
      httpUtil.postRequest('/minip/phone', params, '', function (res) {
        console.log('phone',res)
        if (res.data) {
          that.setData({
            phoneNumber: res.data
          })
          wx.setStorageSync('phone', res.data);
          wx.reLaunch({
            url: '/pages/addInfors/addInfors'
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }, function (res) {
        console.log('phone/error',res)
        try {
          wx.showToast({
            title: res.msg || '需扫码进入登录',
            icon: 'none',
            duration: 1000
          })
        } catch (error) {
          console.log('phone/catcherror',error)
        }
        
      }, 1)
      return;

    }
    
  },
  sessionIsExpire() {
    const session = wx.getStorageSync('sessionCode');
    const deadLine = wx.getStorageSync('deadline');
    const date = new Date(deadLine);
    const nowDate = new Date();
    if (session && deadLine) {
      const dValue = nowDate.getTime() - date.getTime();
      const hour = dValue * 1.0 / (1000 * 60 * 60)
      if (hour >= 24) {
        this.login()
      }
    } else {
      this.login()
    }
  },
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.loginRequest(res.code);
        }
      },
    })
  },
  loginRequest(code) {
    let that = this;
    wx.request({
      url: api.login(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        code: code,
        mch_id:that.data.mch_id
        
      },
      success: (response) => {
        const data = response.data.data;
        if (data) {
          if (data.infoInside) {
            wx.setStorageSync('infoAccess',data.infoInside);
            wx.setStorageSync('sessionCode',data.infoInside);
            wx.setStorageSync('deadline', new Date())
          }
        }
      },
      complete: (res) => {
      }
    })
  },
  showDeal() {

      wx.navigateTo({
        url: '/pages/dealDetail/dealDetail'
      })

      
    },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

    
})
