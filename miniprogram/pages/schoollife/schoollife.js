const db = wx.cloud.database()
var all_articles = [];
var articles_1 = []
var articles_2 = []
var articles_3 = []
var a_1 = []
var a_2 = []
var a_3 = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color_1:'#188FC8',
    color_2:'#C4C4C4',
    color_3:'#C4C4C4',
    articles:[],
    articles_1:[],
    articles_2:[],
    articles_3:[],
    color: ["#81aaf7", "#40bcd0", "#ff6666"],
    isHide:false,
    loadinghide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    all_articles = [];
    articles_1 = []
    articles_2 = []
    articles_3 = []
    a_1 = []
    a_2 = []
    a_3 = []
    this.setData({
      articles_1: 0,
      articles_2: 0,
      articles_3: 0,
    })

    var that = this;

    function compare(p){
      return function(m,n){
        var a = m[p];
        var b = n[p];
        return a-b;
      }
    }
  
      var batchTimes;
      var count = db.collection("schoollife_articles").count();
      count.then(function (result) {
        count = result.total;
        batchTimes = Math.ceil(count / 20)
        var arrayContainer = [], x = 0;
        for (var i = 0; i < batchTimes; i++) {
           db.collection("schoollife_articles").skip(i * 20).get({
            success: function (res) {
              for (var j = 0; j < res.data.length; j++) {
                arrayContainer.push(res.data[j]);
              }
              x++;
              if (x == batchTimes) {
                arrayContainer.sort(compare("_id"));
                for(var i = 0; i < arrayContainer.length; i++){
                  if(arrayContainer[i].label == 1)
                  {
                    articles_1.push(arrayContainer[i]);
                  }
                  else if(arrayContainer[i].label == 2)
                  {
                    articles_2.push(arrayContainer[i]);
                  }
                  else
                  {
                    articles_3.push(arrayContainer[i]);
                  }
                }
                arrayContainer.reverse();
                all_articles = arrayContainer;
                that.setData({
                  articles: articles_1,
                  loadinghide: true,
                })
              }
            }
          })
        }
      });
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
    
  },

  input: function(e){
   this.setData({
    color_1:'#C4C4C4',
    color_2:'#C4C4C4',
    color_3:'#C4C4C4',
   })
   
    var str = e.detail.value;
    if(!str)
    {
      a_1 = [];
      a_2 = [];
      a_3 = [];
      this.setData({
        articles: all_articles,
        articles_1:0,
        articles_2:0,
        articles_3:0,
        isHide: false
      })
      
    }
    else
    {
      a_1 = [];
      a_2 = [];
      a_3 = [];
      this.setData({
        articles: 0,
        articles_1:0,
        articles_2:0,
        articles_3:0,
        
      })
    var list = new Array();
    var search_list = new Array();
    list = all_articles;
    for(var i=0;i<list.length;i++){
      if(list[i].title.indexOf(str)>=0)
      {
        search_list.push(list[i]);
        if(list[i].label == 1)
        {
          a_1.push(list[i]);
        }
        else if(list[i].label == 2)
        {
          a_2.push(list[i]);
        }
        else
        {
          a_3.push(list[i]);
        }
      }
    }
    this.setData({
      articles:search_list,
      articles_1: a_1,
      articles_2: a_2,
      articles_3: a_3,
      isHide: true
    })
    }
  },


  filter_1: function(){
    this.setData({
    color_1:'#188FC8',
    color_2:'#C4C4C4',
    color_3:'#C4C4C4',
    articles: articles_1,
    })

  },

  filter_2: function(){
    this.setData({
    color_2:'#188FC8',
    color_1:'#C4C4C4',
    color_3:'#C4C4C4',
    articles: articles_2,
    })
  },

  filter_3: function(){
    this.setData({
    color_3:'#188FC8',
    color_2:'#C4C4C4',
    color_1:'#C4C4C4',
    articles: articles_3,
    })
  },

  preview: function (e) {
    wx.previewImage({
      current: e.target.dataset.action,
      urls: [e.target.dataset.action]
    })
  },

  goto_article : function(e){
    var app = getApp();
    if (!e.currentTarget.dataset.action){
      wx.showToast({
        title: '审核中👀请耐心等待',
        icon: 'none',
        duration: 2000
      })
      return;
      }
    else if (e.currentTarget.dataset.action==2){
      wx.showToast({
        title: '审核未通过',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    else{
      var stringid;
      app.globalData.article_id = e.currentTarget.dataset.n;
      var id = new Number;
      id = app.globalData.article_id;
      stringid = id.toString();
      db.collection("schoollife_articles").where({
        _id:stringid
      }).get({
        success: function (res) {
          id = res.data[0].click;
          id++;
          var clicked = id;
        wx.cloud.callFunction({
         name:'add_schoollife',
         data:{
           taskId:stringid,
           clicked:clicked
          }
          })
         .then(res => {
    })
    .catch(console.err)
        }
      })  
      wx.navigateTo({
        url: '../../pages/schoollifearticle/schoollifearticle',
      })
    }
  },
})