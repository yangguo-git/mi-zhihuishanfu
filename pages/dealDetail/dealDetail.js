var httpUtil = require('../../utils/httpUtil.js');
Page({
  data: {
    protocolName:'',
    protocolUrl:''
  },
  onLoad: function (options) {
    let mch_id = wx.getStorageSync('mch_id');
    // const params = {mch_id:'TLNTQDquick2020'};
    const params = {mch_id:mch_id};
    this.getDetail(params)
  },
  getDetail(params){
      var that = this;
      httpUtil.getRequest('/face/protocol/list', params, '加载中', function (res) {
        console.log('img',res.data)
        console.log('img',res.data.mchProtocolRecordDOList)
        if (res.data) {
          var result = res.data;
          // var getContent = result.mchProtocolRecordDOList[0];
          // let fileContent = JSON.parse(getContent.protocolInfo);
          // var filePath = fileContent.protocolUrl;//对应的网络路径，可以是内网的或者外网
          var getFirst = JSON.parse(result.mchProtocolRecordDOList[0].protocolInfo);
          var getLists = res.data.mchProtocolRecordDOList;
          getLists.forEach(function(item){
            item.protocolInfo = JSON.parse(item.protocolInfo);
          })
          that.setData({
            protocolName:getFirst.protocolName,
            // protocolUrl:fileContent.protocolUrl,
            imgsArr:getLists
          })
          // wx.downloadFile({//下载对应文件
          //   url: filePath,
          //   success: function (res) {
          //     var filePath = res.tempFilePath;//文件路径
          //     wx.openDocument({
          //       filePath: filePath,//装载对应文件的路径
          //       fileType: 'doc',//指定打开的文件类型
          //       success: function (res) {
          //         console.log("打开成功");
          //       },
          //       fail: function (res) {
          //         console.log(res);
          //       }
          //     })
          //   },
          //   fail: function (res) {
          //     console.log(res);
          //   }
          // })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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