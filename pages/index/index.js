//index.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    weather: "",
    latitude: "36.67",
    longitude: "116.98",
    location: "济南",
    nowBackGround: [100, 8],
    nowTemperature: '0 ℃',
    nowWind: '晴/东北风  微风',
    nowAir: '51  优',
    nowCond_code: 100,
    dailyForecast: [],
    lifeStyle: [],
    isComplete: false
  },
  chooseLocation: function () {
    //获得位置
    var mIndex = this;
    var latitude = "36.67", longitude = "116.98";
    util.showBusy("加载中...")
    wx.getLocation({
      success: function (res) {
        mIndex.setData({ latitude: res.latitude, longitude: res.longitude })
        latitude = res.latitude;
        longitude = res.longitude;
        console.log(res)
      },
      fail: function () {
        mIndex.setData({
          latitude: "36.67",
          longitude: "116.98"
        })
      },
      complete: function () {
        mIndex.Weather(latitude, longitude)
        //util.showSuccess("加载成功");
        mIndex.amapLocation(latitude, longitude)
        //wx.stopPullDownRefresh();
      }
    })
  },
  amapLocation: function (latitude, longitude) {
    var aMap = this;
    var url = "https://restapi.amap.com/v3/geocode/regeo";
    var data = {
      key: "828a55e32d8fc01c7152bc62047c7115",
      location: longitude ? longitude + "," + latitude : "116.98,36.67"
    };
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: function (res) {
        aMap.setData({ location: res.data.regeocode.formatted_address });
      },
      fail: function (res) {
        util.showModel("地址解析失败")
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
    var airUrl = "https://free-api.heweather.com/s6/air";
    var data = {
      key: "f269590b97fa47c58973cc7c70199a07",
      location: location ? longitude + "," + latitude : "auto_ip"
    };
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: function (res) {
        console.log(res.data.HeWeather6[0])
        mWeather.setData({ weather: JSON.stringify(res.data.HeWeather6[0]) })
        var basic = res.data.HeWeather6[0].basic;
        var now = res.data.HeWeather6[0].now;
        var daily = res.data.HeWeather6[0].daily_forecast;
        var lift = res.data.HeWeather6[0].lifestyle;
        mWeather.setData({
          nowBackGround: [now.cond_code, now.tmp],
          nowTemperature: now.tmp + "℃",
          nowWind: now.cond_txt + "   " + now.wind_dir + "   " + now.wind_sc + "级",
          dailyForecast: daily,
          lifeStyle: lift,
          nowCond_code: now.cond_code,
          isComplete: true
        })
        util.showSuccess("加载成功");
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        util.showModel("加载失败")
      }
    });
    wx.request({
      url: airUrl,
      method: "GET",
      data: data,
      success: function (res) {
        console.log(res);
        var nowAirCity = res.data.HeWeather6[0].air_now_city;
        mWeather.setData({
          nowAir: nowAirCity.aqi + "  " + nowAirCity.qlty,
        })
      },
      fail: function (res) {

      }
    })
  }
})
