const app = getApp()
const db = wx.cloud.database()
var util = require('../../utils/util.js')
var dayTime = util.formatTime(new Date())
var article_id = new Number()
var article_array = new Array()
var article_data
var comment;

Page({

  /**
   * Page initial data
   */
  data: {
    time:" ",
    author:" ",
    read:" ",
    title:" ",
    hnode: [{
      _id: "1",
      index_id: "1",
      node: '<img style="border-radius:15px; width: 862px !important; height: auto !important; vertical-align: middle; visibility: visible !important; max-width: 100%; " src="http://m.qpic.cn/psc?/V10ldMks1Z5QlW/bqQfVz5yrrGYSXMvKr.cqTPtnUN7zJo2Kz37cZDcRRVc2vsiXputSKNVw*8pyqRyadlrvjrlbmkEtqNUG8hmTkJqtNAHKJgK8D*TrAEQeuk!/b&bo=9AFpAfQBaQECCS0!&rf=viewer_4">'
    },
  ],
  isHide:true,
  comment:[],
  p_comment:[],
  p1:[],
  p2:[],
  avatar:"",
  nickname:'',
  details:'',
  time:''
},

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      complete: (res) => {
        that.setData({
          avatar: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      },
    })
    this.app = getApp()
    article_id = app.globalData.article_id;
    article_id = article_id.toString();
    db.collection("schoollife_articles_node").where({
      _id: article_id
    }).get({
      success:function(res){
        article_data = res.data[0].node;
        comment = res.data[0].comment;
        var permittedcomment = [];
        var p_1 = [];
        var p_2 = [];
        for(var i = 0; i < comment.length; i++){
          if(comment[i].Ispermitted)
          {
            permittedcomment.push(comment[i]);
          }
        }
        for(var i = 0; i < permittedcomment.length; i++){
          if(i % 2)
           {
             p_1.push(permittedcomment[i]);
           }
           else
           {
             p_2.push(permittedcomment[i]);
           }
        }
        that.setData({
          p1: p_1,
          p2: p_2,
        })
        db.collection("schoollife_articles").where({
          _id: article_id
        }).get({
          success: function (res) {
            article_array.push(res.data[0]);
            wx.setNavigationBarTitle({
              title: article_array[0].title,
            })
            article_array[0].node = article_data;
            var taps = "阅读：" + res.data[0].click;
            that.setData({
              hnode: article_array,
              time: res.data[0].time,
              author: res.data[0].author,
              title: res.data[0].title,
              read:taps,
              comment: comment,
              isHide:false
            })
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
    //延时展现容器2，做到瀑布流的效果
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 100, 0)
    }.bind(this), 100);
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    article_array.pop();
    this.setData({
      hnode:0
    })
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

  input: function(e) {
    this.setData({
      details:e.detail.value
    })
  },

  submit_comment: function () {
    var that = this;
    if(!this.data.details)
    {
      wx.showModal({
        cancelColor: 'grey',
        title:'提示',
        content:'评论不能为空。',
        confirmText:'继续阅读',
        success: function (res) {
          if (res.cancel) 
          {
          } 
          else {
            wx.pageScrollTo({
              scrollTop: 0,
            })
          }
       },
      })
    }
    else
    {
    var now = dayTime.toString();
    now = now.slice(0,16);
    var id = Number(article_id);
    var stringid = article_id.toString();
    var my_comment = new Object();
    my_comment.Avatar = this.data.avatar;
    my_comment.Details = this.data.details;
    my_comment.Ispermitted = true;
    my_comment.Name = this.data.nickname;
    my_comment.Time = dayTime.toString().slice(0,16);
    my_comment.len = 0;
    var l = my_comment.Details.length;
    if(l <= 20)
    {
      my_comment.len = 200;
    }
   else
    {
     my_comment.len = 600 * Math.floor(l / 10) / Math.sqrt(l) ;
    }
    var count = 0;
    for(var i = 0; i< comment.length; i++)
    {
      if(comment[i].Name == my_comment.Name)
      {
        count++;
      }
    }
    if(count >= 3)
    {
      wx.showModal({
        cancelColor: 'grey',
        title:'提示',
        content:'抱歉，您评论过多，未提交该评论。',
        confirmText:'继续阅读',
        success: function (res) {
          if (res.cancel) 
          {
          } 
          else {
            wx.pageScrollTo({
              scrollTop: 0,
            })
          }
       },
      })
    }
    else
    {
      wx.cloud.callFunction({
        name:'s_check_text',
        data:{
        text:that.data.details
        }
      }).then(res => {
        var check = res.result.code
        if(check == 200)
        {
          comment.push(my_comment);
      wx.cloud.callFunction({
      name:'add_schoollife_comment',
      data:{
        taskId: stringid,
        my_comment: comment,
       }
       }).then(res => {
        wx.showModal({
          cancelColor: 'grey',
          title:'😄',
          content:'您的评论提交成功。',
          confirmText:'继续阅读',
          success: function (res) {
            if (res.cancel) 
            {
            } 
            else {
              wx.pageScrollTo({
                scrollTop: 0,
              })
            }
         },
        })
 })
        }
        else
        {
          wx.showToast({
            title: '🚫包含敏感字哦!',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  }
 }
})