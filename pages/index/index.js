//index.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    weather: "",
    latitude: "",
    longitude: "",
    location: "济南",
    nowBackGround: [100, 8],
    nowTemperature: '0 ℃',
    nowWind: '晴/东北风  微风',
    nowAir: '50  优',
    hourlyArr: [],
    dailyForecast: [],
    lifeStyle: [],
  },
  chooseLocation:function(){
    //获得位置
    var mIndex = this;
    util.showBusy("加载中...")
    wx.getLocation({
      success: function (res) {
        mIndex.setData({ latitude: res.latitude, longitude: res.longitude })
        console.log(res.latitude + "," + res.longitude)
        mIndex.Weather(res.latitude, res.longitude)
        util.showSuccess("加载成功")
        wx.stopPullDownRefresh();
      },
      fail: function () {
        util.showModel("加载失败")
      }
    })
  },
  onLoad: function () {
    this.chooseLocation()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(
      this.chooseLocation()
    )
  },
  Weather: function (latitude, longitude) {
    var mWeather = this;
    //数据集合
    var url = "https://free-api.heweather.com/s6/weather";
    var data = {
      key: "f269590b97fa47c58973cc7c70199a07",
      location: location ? longitude + "," + latitude : "auto_ip"
    };
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: function (res) {
        util.showSuccess("加载成功")
        console.log(res.data.HeWeather6[0])
        mWeather.setData({ weather: JSON.stringify(res.data.HeWeather6[0])})
        var basic = res.data.HeWeather6[0].basic;
        var now = res.data.HeWeather6[0].now;
        var hourly = res.data.HeWeather6[0].hourly;
        var daily = res.data.HeWeather6[0].daily_forecast;
        var lift = res.data.HeWeather6[0].lifestyle;
        mWeather.setData({
          nowBackGround: [now.cond_code, now.tmp],
          nowTemperature: now.tmp + "℃",
          nowWind: now.cond_txt + "/" + now.wind_dir + "   " + now.wind_sc,
          hourlyArr: hourly,
          dailyForecast: daily,
          lifeStyle: lift,
          location: basic.location
        })
      },
      fail: function (res) {
        util.showModel("加载失败")
      }
    });
  }
})
