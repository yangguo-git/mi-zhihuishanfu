var httpUtil = require('../../utils/httpUtil.js');
Page({
  data: {
    checkStatus: '',
    checkTime: '',
    faceStatus:'',
    idCard:'',
    userName:''
  },
  onLoad: function (options) {
    console.log(options,'credentials')
    if(options.obj){
      let getObj = JSON.parse(options.obj);
      this.setData({
        checkTime:getObj.checkTime,
        idCard:getObj.idCard,
        userName:getObj.userName
      })
    }else{
      let userName = wx.getStorageSync('userName');
      let idCard =  wx.getStorageSync('idCard');
      let phone = wx.getStorageSync('phone');
      let mch_id = wx.getStorageSync('mch_id');
      let params = {
        userName,
        idCard,
        phone,
        mch_id
      }
      this.getResult(params)
    }
  },
  getResult(params){
    let that = this;
    httpUtil.getRequest('/face/qry', params, '', function (res) {
      console.log("/face/qry",res)
      console.log('params',params)
      if (res.data.userName ||res.data.idCard) {
        that.setData({
          checkTime:res.data.checkTime,
          idCard:res.data.idCard,
          userName:res.data.userName
        })
      }else{
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      }
    }, function (res) {
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