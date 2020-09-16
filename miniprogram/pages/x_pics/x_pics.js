// pages/x_pics/x_pics.js
const db = wx.cloud.database();
var app = getApp();
var image_url = new Array();
Page({

  /**
   * Page initial data
   */
  data: {
   x_pics:0,
   amount:'',
   image_url:[],
   top:0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      top: app.globalData.navBarHeight
    })
    this.app = getApp();
    var that = this;
    var batchTimes;
    var count = db.collection("xitucheng_pics").count();
    count.then(function(result){
      count = result.total;
      batchTimes = Math.ceil(count / 20)
    var arrayContainer = [], x = 0;
    for(var i=0;i<batchTimes;i++){
      db.collection("xitucheng_pics").skip(i*20).get({success:function(res){
          for(var j=0;j<res.data.length;j++){
            arrayContainer.push(res.data[j]);
            image_url.push(res.data[j].url);
          }
          x++;
      if(x==batchTimes)
      {
       that.setData({
         x_pics: arrayContainer,
         amount: arrayContainer.length + '张'
       })
      }
      }
      })
     }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.app.slideupshow(this, 'slide_up1', 0, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 0, 1)
    }.bind(this), 200);
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    this.app.slideupshow(this, 'slide_up1', 100, 0)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 100, 0)
    }.bind(this), 100);
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  preview: function(e){
    wx.previewImage({
      current: e.target.dataset.action,
      urls: image_url,
    })
  }
})