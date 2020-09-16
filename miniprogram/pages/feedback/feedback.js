const db = wx.cloud.database()
var util = require('../../utils/util.js')
var dayTime = util.formatTime(new Date())

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:"获取昵称中",
    avatar:"",
    name:"",
    agearray:[],
    age:"请选择年龄",
    gen:"获取性别中",
    loc:"打开定位，点击右侧图标获取位置",
    phone:"",
    QQ:"",
    email:"",
    fb:"",
    isAnonymous:false,
    fbmail:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var gender = res.userInfo.gender == 1 ? "男" : "女";
        that.setData({
          gen: gender,
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl
        })
    }
  })
  var age_array = [];
  age_array.push("保密");
  for(var i = 1; i <= 150; i++){
      age_array.push(i);
  }
  this.setData({
    agearray: age_array,
  })
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

  setanno: function (e) {
    this.setData({
      isAnonymous: e.detail.value,
    })
  },

  setemail: function (e) {
    this.setData({
      fbmail: e.detail.value,
    })
  },

  agechange: function (e) {
    var real_age = e.detail.value;
    if(e.detail.value == '0')
    {
      real_age = "保密"
    }
    this.setData({
     age: real_age
    })
  },

  get_location: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          url: "https://apis.map.qq.com/ws/geocoder/v1/?location=",
          type: "GET",
          data: {
              location: latitude + "," + longitude,
              key: "NXQBZ-ZXUCW-BG7RT-RVP4K-7TUOO-WKFPP",
              output: "json"
          },
          success: function (res) {
              var location = res.data.result.address_component;
              var address = location.province + " " + location.city +" "+ location.district;
              that.setData({
                loc: address
              })       
          }
        })
      }
    })
  },

  input_name: function(e){
    this.setData({
      name: e.detail.value
    })
  },

  input_phone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  input_QQ: function(e){
    this.setData({
      QQ: e.detail.value
    })
  },

  input_email: function(e){
    this.setData({
      email: e.detail.value
    })
  },

  input_fb: function(e){
    this.setData({
      fb: e.detail.value
    })
  },

  submit: function(){
    var that = this;
    var nickname = this.data.nickname;
    var avatarUrl = this.data.avatar;
    var realname = this.data.name;
    var age = this.data.age;
    var gender = this.data.gen;
    var location = this.data.loc;
    var phone = this.data.phone;
    var QQ = this.data.QQ;
    var email = this.data.email;
    var feedback = this.data.fb;
    if(age =='请选择年龄')
    {
      wx.showModal({
        cancelColor: 'grey',
        title:'🥺',
        content:'请选择您的年龄。若不想告诉我们，就选择"保密"呦~'
      })
    }
    else
    {
      if(location == '打开定位，点击右侧图标获取位置')
      {
        wx.showModal({
          cancelColor: 'grey',
          title:'🥺',
          content:'未获取到您的位置，请打开定位。'
        })
        return;
      }
      else
      {
        if(!phone)
        {
          wx.showModal({
            cancelColor: 'grey',
            title:'🥺',
            content:'请输入您的手机号码，以便联系。'
          })
          return;
        }
        else
        {
          if(!QQ)
          {
            wx.showModal({
              cancelColor: 'grey',
              title:'🥺',
              content:'请输入您的QQ号码，以便联系。'
            })
            return;
          }
          else
          {
            if(!feedback)
            {
              wx.showModal({
                cancelColor: 'grey',
                title:'😁',
                content:'请您提供宝贵意见！'
              })
              return;
            }
            else
            {
              var isAnonymous = that.data.isAnonymous;
              var isEmail = that.data.fbmail;
              if((isAnonymous == false && !realname) || (isEmail == false && !email))
              {
                wx.showModal({
                  cancelColor: 'grey',
                  title:'😁',
                  content:'请填写选填项（姓名、电子邮箱），或打开"匿名"开关。'
                })
                return;
              }
              else
              {
                var islegal_phone;
                var l_p = phone.length;
                var islegal_email;
                var l_e = email.indexOf('@');
                if(QQ.length < 5)
                {
                  wx.showModal({
                    cancelColor: 'grey',
                    title:'❌',
                    content:'QQ号码长度错误。'
                  })
                  return;
                }
                if(l_p != 11)
                {
                  wx.showModal({
                    cancelColor: 'grey',
                    title:'❌',
                    content:'手机号码长度错误。'
                  })
                  return;
                }
                if(phone[0] != 1)
                {
                  wx.showModal({
                    cancelColor: 'grey',
                    title:'😂',
                    content:'您的手机号码真的是' + '"' + phone[0] + '"' + '开头的么？'
                  })
                  return;
                }
                if(isNaN(phone))
                {
                  wx.showModal({
                    cancelColor: 'grey',
                    title:'❌',
                    content:'您输入了含非法字符的手机号码。'
                  })
                  return;
                }
                if((l_e<=0 || l_e == email.length - 1 || email.indexOf(".") == -1) && isEmail == false)
                {
                  wx.showModal({
                    cancelColor: 'grey',
                    title:'❌',
                    content:'电子邮箱格式错误。'
                  })
                  return;
                }
                if(isAnonymous == true) realname = null;
                if(isEmail == true) email = null;
                db.collection('feedback').where({
                  Nickname: nickname
                }).get({
                  success(res){
                    if(res.data.length < 3)
                    {
                      db.collection('feedback').add({
                        data:{
                          submission: dayTime,
                          Nickname: nickname,
                          Avatar: avatarUrl,
                          Realname: realname,
                          Age: age,
                          Gender: gender,
                          Location: location,
                          Phone: phone,
                          QQnum: QQ,
                          Email: email,
                          feedback :feedback,
                        }
                      })
                      wx.showModal({
                        title: '提交成功',
                        content:'感谢您的参与。 剩余提交次数：' + (2-res.data.length) +'。',
                        confirmText:'回主页面',
                        success: function (res) {
                          if (res.cancel) 
                          {
                          } 
                          else {
                             //点击确定
                            wx.navigateTo({
                              url: '../../pages/index/index',
                            })
                          }
                       },
                      })
                    }
                    else
                    {
                      wx.showModal({
                        cancelColor: 'grey',
                        title:'❌',
                        content:'最多提交3次反馈。',
                        confirmText:'回主页面',
                        success: function (res) {
                          if (res.cancel) 
                          {

                          } 
                          else {
                             //点击确定
                            wx.navigateTo({
                              url: '../.2./pages/index/index',
                            })
                          }
                       },
                      })
                    }
                  }
                })
              }
            }
          }
        }
      }
    }
  }
})