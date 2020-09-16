const app = getApp()
const db = wx.cloud.database()
const _ = db.command
var counter = 0
var util = require('../../utils/util.js')
var dayTime = util.formatTime(new Date())

Page({
 
  data:{
    userImage:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587639594257&di=87302de04bc4ed38b5e059b88752f019&imgtype=0&src=http%3A%2F%2Fhbimg.huabanimg.com%2Fe10314b498004a63ef1651fac2db953ce1b5f7836d28-WMDxGt_fw658',
    userInfo:0,
    userWelcome:"您好！",
    userTip:"欢迎关注北京邮电大学！",
    top: 0,
    pageView:0,
    text: "……………………………………公告加载中……………………………………",
    pace: 0.5,//滚动速度
    distance: 0,//初始滚动距离
    margin: 0,
    size: 28,
    interval: 15, // 时间间隔
    blank:"\n",
logo:"https://www.bupt.edu.cn/__local/1/F4/62/05815E603799A29D53DDB1E0FAF_557A7220_102AD.png",
    b1:"http://photogz.photo.store.qq.com/psc?/V10ldMks1MA0AI/wK0kFdeCHxQUuvx1sBu8JFfmALHMx0qy4.y4qcpaqkMzoteWZlXTIIAHX6n5jitj5X42d*VuqUUnvkDyAhQthA!!/b&bo=DwEPAQAAAAADByI!&rf=viewer_4",
    b2:"http://m.qpic.cn/psc?/V10ldMks1MA0AI/wK0kFdeCHxQUuvx1sBu8JD1XnYZkZOWI*B6gslV9XhEFrt0YTmyGkHI7ip4n*JlFJ2SMxbVRC5QYBOxS6xzb2g!!/b&bo=DwEPAQ8BDwEDCSw!&rf=viewer_4",
    b3:"http://m.qpic.cn/psc?/V10ldMks1MA0AI/wK0kFdeCHxQUuvx1sBu8JPkshxrBRv7Gg643y4FhOWzz*ihRiJEQyXOGQ5LHfG*bchDoa2O0szm5cNOmBvg7CA!!/b&bo=DwEPAQ8BDwEDCSw!&rf=viewer_4",
    b4:"http://m.qpic.cn/psc?/V10ldMks1MA0AI/wK0kFdeCHxQUuvx1sBu8JKDVuhLa*XiOsYs68OKAC696DfWjNape1ALu*EfxUwFQyzWEkhYidizOW.y*ej.2tA!!/b&bo=DwEPAQAAAAADByI!&rf=viewer_4",
    b5:"http://m.qpic.cn/psc?/V10ldMks1MA0AI/wK0kFdeCHxQUuvx1sBu8JC2StGhRXWnV4Gm19rGrr10OxMB9jaPWfyKWiq3H5IpJ1dNYhcWBwGH937mPabHl.g!!/b&bo=MAIPAQAAAAADBx4!&rf=viewer_4",
    b6:"http://m.qpic.cn/psc?/V10ldMks1MA0AI/wK0kFdeCHxQUuvx1sBu8JN9o33ynzXxEedYI9l15x9jRjGz33JlxpXYLvy8xSg7X5HhqdTN9MJeQU*4UhVnWnA!!/b&bo=MAIPAQAAAAADBx4!&rf=viewer_4",
    poster:0,
    hnode:[{
      _id:"1",
      index_id:"1",
      node: '<img style="border-radius:15px; width: 862px !important; height: auto !important; vertical-align: middle; max-width: 100%; " src="https://mmbiz.qpic.cn/mmbiz_jpg/VzFuMauwoqTc6bRD4ibOr9ib60UjMDe4jLVkxsI8zYVAibUfFdEibricL0C3fwrIFJlWCIAsZ0yULMvJgZggtOniaqGA/640?wx_fmt=jpeg&amp;tp=webp&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" crossorigin="anonymous" data-w="1080" data-type="jpeg" data-src="https://mmbiz.qpic.cn/mmbiz_jpg/VzFuMauwoqTc6bRD4ibOr9ib60UjMDe4jLVkxsI8zYVAibUfFdEibricL0C3fwrIFJlWCIAsZ0yULMvJgZggtOniaqGA/640?wx_fmt=jpeg" data-ratio="0.3740741" _width="862px" data-fail="0">'
    },
    ],
    articles:0,
    search_articles:0,
    color: ["#81aaf7", "#40bcd0", "#ff6666"]
  },
  
  
  
  onLoad: function (options) {
    
    dayTime = Number(dayTime.slice(11,13));
    if (dayTime >= 0 && dayTime < 11) dayTime = "早上好~ ！";
    if (dayTime >= 11 && dayTime < 13) dayTime = "中午好~ ！";
    if (dayTime >= 13 && dayTime < 17) dayTime = "下午好~ ！";
    if (dayTime >= 17 && dayTime < 24) dayTime = "晚上好~ ！";
    this.setData({
      top: app.globalData.navBarHeight,
    })
    var that = this;
    db.collection("text").where({
      _id:"1"
    }).get({success:function(res){
      that.setData({
        text:res.data[0].content
      })
    }})
    db.collection("text").where({
      _id:"2"
    }).get({success:function(res){
      that.setData({
       //hnode:res.data
      })
    }
    })
    db.collection("posters").get({success:function(res){
      that.setData({
        poster:res.data
      })
    }

    })
    
  function compare(p){
    return function(m,n){
      var a = m[p];
      var b = n[p];
      return a-b;
    }
  }

    var batchTimes;
    var count = db.collection("articles").count();
    count.then(function (result) {
      count = result.total;
      batchTimes = Math.ceil(count / 20)
      var arrayContainer = [], x = 0;
      for (var i = 0; i < batchTimes; i++) {
         db.collection("articles").skip(i * 20).get({
          success: function (res) {
            for (var j = 0; j < res.data.length; j++) {
              arrayContainer.push(res.data[j]);
            }
            x++;
            if (x == batchTimes) {
              arrayContainer.sort(compare("_id"));
              arrayContainer.reverse();
              that.setData({
               articles:arrayContainer,
               search_articles:arrayContainer})
            }
          }
        })
      }
    });

    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  onShow: function () {
    this.app = getApp();
    this.app.slideupshow(this, 'slide_up1', 0, 1)

    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 0, 1)
    }.bind(this), 200);
    var that = this;
  },

  onPageScroll: function (e) {    
    if (e.scrollTop > 800) 
    { 
      this.setData({ showTop: false }) 
    } 
    else 
    { 
      this.setData({ showTop: true }) 
      } 
    },
  
  onPullDownRefresh(){
    var that = this;
    db.collection("articles").get({
      success: function (res) {
        that.setData({
          articles: res.data
        })
      }
    })
    if(that.data.articles) wx.stopPullDownRefresh();
  },

  onHide: function () {
    this.app.slideupshow(this, 'slide_up1', 100, 0)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 100, 0)
    }.bind(this), 100);
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.margin;//滚动的最大宽度，文字宽度+间距
        var crentleft = that.data.distance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            distance: crentleft + that.data.pace
          })
        } else {
          that.setData({
            distance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    } else {
      that.setData({ margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },

  goto_miniprogram1:function() {
    wx.navigateToMiniProgram({
      appId: 'wxefaf5e5f6d0db43b',
    })
  },
  
  goto_miniprogram2 : function(){
   wx.navigateToMiniProgram({
     appId: 'wx5a4294756cb7eaa6',
   })
  },

  goto_schoollife : function(){
    wx.navigateTo({
      url: '../../pages/schoollife/schoollife',
    })

  },

  goto_chat : function(){
     wx.navigateTo({
       url: '../../pages/im/room/room',
     })
  },

  goto_x_pics : function(){
     wx.navigateTo({
       url: '../../pages/x_pics/x_pics',
     })
  },

  goto_s_pics : function () {
    wx.navigateTo({
       url: '../../pages/s_pics/s_pics',
     })
  },

  goto_feedback : function(){
    wx.navigateTo({
      url: '../../pages/feedback/feedback',
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
      db.collection("articles").where({
        _id:stringid
      }).get({
        success: function (res) {
          id = res.data[0].click;
          id++;
          var clicked = id;
        wx.cloud.callFunction({
         name:'add',
         data:{
           taskId:stringid,
           click:clicked
          }
          })
         .then(res => {
    })
    .catch(console.err)
        }
      })
    }

    wx.navigateTo({
      url: '../../pages/article/article',
    })
  },

  getUserInfo: function () {
    var that = this
    wx.getSetting({
      success:function(res){
        if (res.authSetting['scope.userInfo']){
          _getUserInfo();
        }
        else{
          wx.showToast({
            title: '⊗您拒绝了授权',
            icon:'none'
          })
        }
      }
    })
    wx.requestSubscribeMessage({
      tmplIds: ['46LXRpxODP83gcJSukjkk0YOn6Jmm-qHsib0F-_9JUc'],
      success(res) {
        console.log(1);
      }
    })

    function _getUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        var welcome = res.userInfo.nickName + (res.userInfo.gender == 1 ? "先生" : "女士") + "，欢迎您！";
        that.setData({
          userInfo: res.userInfo,
          userWelcome: welcome,
          userImage: res.userInfo.avatarUrl,
          userTip: dayTime
        })
      }
    })
    }
  },
  
  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  input:function(e){
  var str = e.detail.value;
  if(!str)
  {
    var a = this.data.articles;
    this.setData({
      search_articles: a
    })
  }
  else
  {
    this.setData({
      search_articles: 0
    })
  var list = new Array();
  var search_list = new Array();
  list = this.data.articles;
  for(var i=0;i<list.length;i++){
    if(list[i].title.indexOf(str)>=0)
    {
      search_list.push(list[i]);
      this.setData({
        search_articles:search_list
      })
    }
  }
  }
  },

  preview: function (e) {
    wx.previewImage({
      current: e.target.dataset.action,
      urls: [e.target.dataset.action]
    })
  },

})

