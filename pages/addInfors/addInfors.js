const utils = require("../../utils/util.js")
var httpUtil = require('../../utils/httpUtil.js');
let appShow = false;
Page({
  data: {
     username:'',
     idcard:'',
     isDisabled:false
  },
  onLoad: function (options) {
    
    appShow = !appShow; 
    wx.onAppShow((res) => {
      if (!appShow) {
        appShow = !appShow; 
        console.log("wx.onAppShow",res)
        if (res.referrerInfo && res.referrerInfo.extraData) {
           let getFlag = res.referrerInfo.extraData.isValid;
           if(getFlag){
             this.updateCheck(1)
           }else{
            //  this.updateCheck(0)
            console.log('flag',getFlag)
           }
        }
      }
    })
  },
  name_input(e){
    this.setData({
      username:e.detail.value
    })
  },
  code_input(e){
    this.setData({
      idcard:e.detail.value
    })
  },
  commitSuccess(){
    let that = this;
    let phone = wx.getStorageSync('phone');
    if(this.data.username == ""){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration:1000
      })
      return;
    }
    if(this.data.idcard == ""){
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
        duration:1000
      })
      return;
    }else if(!utils.checkCard(this.data.idcard)){
      wx.showToast({
        title: '请输入正确的证件号码',
        icon: 'none',
        duration:1000
      })
      return;
    }
    wx.setStorageSync('userName', this.data.username);
    wx.setStorageSync('idCard', this.data.idcard);
    //提交参数
    let mch_id = wx.getStorageSync('mch_id');
    let params = {
        userName:this.data.username,
        idCard:this.data.idcard,
        phone:phone,
        mch_id:mch_id

    }
    //按钮禁用
    this.setData({
      isDisabled:true
    })
    httpUtil.postRequest('/face/save', params, '', function (res) {
      console.log('/face/save',res)
      if (res.data) {
        that.setData({
          isDisabled:false
        })
        const encryptIdCard = res.data.encryptIdCard;
        const encryptUserName =res.data.encryptUserName;
        wx.navigateToMiniProgram({
          appId: 'wxf1804469c930c1b6',
          path: 'pages/identity/index',
          extraData: {
            name: encodeURIComponent(encryptUserName),
            card:encodeURIComponent(encryptIdCard),
            channel:"zhsf"
          },
          envVersion: 'release',
          success(res) {
            console.log(res,'打开成功')
            appShow = false;
          },
          fail:function(error){
            console.log(error,'打开失败')
          }
        })
        
      }else{
        that.setData({
          isDisabled:false
        })
        wx.showToast({
          title: res.msg || '请输入真实的姓名和身份证号',
          icon: 'none',
          duration: 1000
        })
      }

    }, function (res) {
      that.setData({
        isDisabled:false
      })
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    },1)
    
  },
  updateCheck:function(faceStatus){//更新
    let phone = wx.getStorageSync('phone');
    let mch_id = wx.getStorageSync('mch_id');
    let params = {
      faceStatus: faceStatus,
      userName:this.data.username,
      idCard:this.data.idcard,
      phone,
      mch_id:mch_id
    }
    console.log('gengxin',params)
    httpUtil.postRequest('/face/update', params, '请稍等', function (res) {
      console.log('update',res)
      if (res.status == 0) {
        wx.reLaunch({
          url: '/pages/registerSuccess/registerSuccess'
        })
      }else{
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      }
    },function (res) {
      console.log('update1',res)
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    },1)
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})