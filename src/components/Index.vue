<template>
  <div class="index">
    <header>
        <img class="logoimg" src="../assets/logo.png">
        <span class="webTitle">{{ title }}</span>
        <span class="descript">{{ description }}</span>
        <span class="top-date">{{ currentDate }}</span>
        <span class="top-user">{{ topuser }}</span>
    </header>
    
    <div class="bottom">
      <main class="middle-content">
        <div class="content-top">
          <el-button class="studyBtn">学习</el-button>
          <el-button class="workBtn">工作</el-button>
          <el-button class="lifeBtn">生活</el-button>
          <el-button class="enjoyBtn">娱乐</el-button>
        </div>
        <div class="content-middle">
          <div class="studyContent" v-if="studyShow">
            <el-row :gutter="20">
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12"><div class="grid-content-bottom bg-purple"></div></el-col>
              <el-col :span="12"><div class="grid-content-bottom bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
              <div class="useBtn">
                <el-button class="editBtn">编辑</el-button>
                <el-button class="saveBtn">保存</el-button>
                <el-button class="cancelBtn">取消</el-button>
                <el-button class="exportBtn">导出</el-button>
              </div>
            </el-row>
          </div>
          <div class="workContent" v-if="workShow"></div>
          <div class="lifeContent" v-if="lifeShow"></div>
          <div class="enjoyContent" v-if="enjoyShow"></div>
        </div>
        <div class="content-bottom">
            © 2021 Powered by HB  
        </div>
      </main>
      <nav class="middle-left">
        <div class="left-top-title">- 时事新闻</div>
        <div class="left-top-content">
          <div v-for="item in newItems" :key="item.index">
            <a :href="item.link" target="_blank">{{ item.index }}. {{ item.text }}</a>
          </div>
        </div>
        <div class="left-bottom-content">-不断向前-</div>
      </nav>
      <aside class="middle-right">
        <div class="right-top-content">
          <div class="box" id="clock">
            <!-- 原点 -->
            <div class="origin"></div>
            <!-- 时钟数 -->
            <div class="dot_box">
                <div class="dot">6</div>
                <div class="dot">5</div>
                <div class="dot">4</div>
                <div class="dot">3</div>
                <div class="dot">2</div>
                <div class="dot">1</div>
                <div class="dot">12</div>
                <div class="dot">11</div>
                <div class="dot">10</div>
                <div class="dot">9</div>
                <div class="dot">8</div>
                <div class="dot">7</div>
            </div>
            <!-- 时、分、秒针 -->
            <div class="clock_line hour_line" id="hour_line"></div>
            <div class="clock_line minute_line" id="minute_line"></div>
            <div class="clock_line second_line" id="second_line"></div>
            <!-- 日期 -->
            <div class="date_info" id="date_info"></div>
            <!-- 时间 -->
            <div class="time_info" >
                <div class="time" id="hour_time"></div>
                <div class="time" id="minute_time"></div>
                <div class="time" id="second_time"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
var appData = require('../../hotSearch.json');

export default {
  name: 'Index',
  data () {
    return {
      title: '凡人修仙站',
      description: '一个整理自己生活的空间',
      newItems: appData,
      datetime: '',
      nongli: '',
      currentDate: '',
      topuser: 'bhuang',
      studyShow: true,
      workShow: false,
      lifeShow:false,
      enjoyShow:false
    }
  },
  created(){
    
  },
  mounted(){
    this.showClock();
    this.newtime();
  },
  methods:{
    showClock(){
      var clock = document.getElementById("clock");
      function initNumXY(){
          // 1、12个数字的位置设置
          var radius = 80;//大圆半价
          var dot_num = 360/$(".dot").length;//每个div对应的弧度数
          //每一个dot对应的弧度;
          var ahd = dot_num*Math.PI/180;
          $(".dot").each(function(index, el) {
              $(this).css({
                  "left":90+Math.sin((ahd*index))*radius,
                  "top":90+Math.cos((ahd*index))*radius
              });
          });
          // 2、刻钟设置
          for(var i = 0; i < 60; i++) {
              clock.innerHTML += "<div class='clock-scale'> " + 
                    "<div class='scale-hidden'></div>" + 
                    "<div class='scale-show'></div>" + 
                    "</div>";
          }
          var scale = document.getElementsByClassName("clock-scale");
              for(var i = 0; i < scale.length; i++) {
                  scale[i].style.transform="rotate(" + (i * 6 - 90) + "deg)";
          }
      }
      initNumXY();//调用上面的函数
      //获取时钟id
      var hour_line = document.getElementById("hour_line"),
          minute_line = document.getElementById("minute_line"),
          second_line = document.getElementById("second_line"),
          date_info = document.getElementById("date_info"),//获取date_info
          hour_time = document.getElementById("hour_time"),// 获去时间id
          minute_time = document.getElementById("minute_time"),
          second_time = document.getElementById("second_time");
      //3、设置动态时间
      function setTime(){
          var nowdate = new Date();
          //获取年月日时分秒
          var year = nowdate.getFullYear(),
              month = nowdate.getMonth()+1,
              day = nowdate.getDay(),
              hours = nowdate.getHours(),
              minutes = nowdate.getMinutes(),
              seconds = nowdate.getSeconds(),
              date = nowdate.getDate();
          var weekday =["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
          // 获取日期id
          date_info.innerHTML = weekday[day];
          hour_time.innerHTML = hours >=10 ? hours : "0"+hours;
          minute_time.innerHTML = minutes >=10 ? minutes : "0"+minutes;
          second_time.innerHTML = seconds >=10 ? seconds : "0"+seconds;
          //时分秒针设置
          var hour_rotate = (hours*30-90) + (Math.floor(minutes / 12) * 6);
          hour_line.style.transform = 'rotate(' + hour_rotate + 'deg)';
          minute_line.style.transform = 'rotate(' + (minutes*6 - 90) + 'deg)';
          second_line.style.transform = 'rotate(' + (seconds*6 - 90)+'deg)';
      }
      // setTime();
      setInterval(setTime, 1000);   
    },
    newtime() {
      let date = this.formatDate(new Date());
      this.datetime = date;
      debugger
      this.hdnongli();
    },
    formatDate: function (date) {
      function addDateZero(num) {
        return (num < 10 ? "0" + num : num);
      }
      var d = new Date(date);
      var formatdatetime = d.getFullYear() + '年' + addDateZero(d.getMonth() + 1) + '月' + addDateZero(d.getDate()) + '日';
      return formatdatetime;				
    },
    hdnongli() {
      debugger
      var CalendarData = new Array(100);
      var madd = new Array(12);
      var tgString = "甲乙丙丁戊己庚辛壬癸";
      var dzString = "子丑寅卯辰巳午未申酉戌亥";
      var numString = "一二三四五六七八九十";
      var monString = "正二三四五六七八九十冬腊";
      var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
      var cYear, cMonth, cDay, TheDate;
      CalendarData = new Array(
        0xa4b,0x5164b,0x6a5,0x6d4,0x415b5,0x2b6,0x957,0x2092f,0x497,0x60c96,0xd4a,0xea5,0x50da9,0x5ad,0x2b6,0x3126e,
        0x92e,0x7192d,0xc95,0xd4a,0x61b4a,0xb55,0x56a,0x4155b,0x25d,0x92d,0x2192b,0xa95,0x71695,0x6ca,0xb55,0x50ab5,
        0x4da,0xa5b,0x30a57,0x52b,0x8152a,0xe95,0x6aa,0x615aa,0xab5,0x4b6,0x414ae,0xa57,0x526,0x31d26,0xd95,0x70b55,
        0x56a,0x96d,0x5095d,0x4ad,0xa4d,0x41a4d,0xd25,0x81aa5,0xb54,0xb6a,0x612da,0x95b,0x49b,0x41497,0xa4b,0xa164b,
        0x6a5,0x6d4,0x615b4,0xab6,0x957,0x5092f,0x497,0x64b,0x30d4a,0xea5,0x80d65,0x5ac,0xab6,0x5126d,0x92e,0xc96,
        0x41a95,0xd4a,0xda5,0x20b55,0x56a,0x7155b,0x25d,0x92d,0x5192b,0xa95,0xb4a,0x416aa,0xad5,0x90ab5,0x4ba,0xa5b,
        0x60a57,0x52b,0xa93,0x40e95);
      madd[0] = 0;
      madd[1] = 31;
      madd[2] = 59;
      madd[3] = 90;
      madd[4] = 120;
      madd[5] = 151;
      madd[6] = 181;
      madd[7] = 212;
      madd[8] = 243;
      madd[9] = 273;
      madd[10] = 304;
      madd[11] = 334;

      function GetBit(m, n) {
        return (m >> n) & 1;
      }

      function e2c() {
        TheDate = arguments.length != 3
            ? new Date()
            : new Date(arguments[0], arguments[1], arguments[2]);
        var total, m, n, k;
        var isEnd = false;
        var tmp = TheDate.getYear();
        if (tmp < 1900) {
          tmp += 1900;
        }
        total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
        if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
          total++;
        }
        for (m = 0; ; m++) {
          k = CalendarData[m] < 0xfff ? 11 : 12;
          for (n = k; n >= 0; n--) {
            if (total <= 29 + GetBit(CalendarData[m], n)) {
              isEnd = true;
              break;
            }
            total = total - 29 - GetBit(CalendarData[m], n);
          }
          if (isEnd) break;
        }
        cYear = 1921 + m;
        cMonth = k - n + 1;
        cDay = total;
        if (k == 12) {
          if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth = 1 - cMonth;
          }
          if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth--;
          }
        }
      }

      function GetcDateString() {
        var tmp = "";
        tmp += tgString.charAt((cYear - 4) % 10);
        tmp += dzString.charAt((cYear - 4) % 12);
        tmp += "(";
        tmp += sx.charAt((cYear - 4) % 12);
        tmp += ")年 ";
        if (cMonth < 1) {
          tmp += "(闰)";
          tmp += monString.charAt(-cMonth - 1);
        } else {
          tmp += monString.charAt(cMonth - 1);
        }
        tmp += "月";
        tmp += cDay < 11 ? "初" : cDay < 20 ? "十" : cDay < 30 ? "廿" : "三十";
        if (cDay % 10 != 0 || cDay == 10) {
          tmp += numString.charAt((cDay - 1) % 10);
        }
        return tmp;
      }

      function GetLunarDay(solarYear, solarMonth, solarDay) {
        if (solarYear < 1921 || solarYear > 2021) {
          return "";
        } else {
          solarMonth = parseInt(solarMonth) > 0 ? solarMonth - 1 : 11;
          e2c(solarYear, solarMonth, solarDay);
          return GetcDateString();
        }
      }

      var D = new Date();
      var yy = D.getFullYear();
      var mm = D.getMonth() + 1;
      var dd = D.getDate();
      var ww = D.getDay();
      var ss = parseInt(D.getTime() / 1000);
      if (yy < 100) yy = "19" + yy;
      function showCal() {
        let nonglitime = GetLunarDay(yy, mm, dd);
        return nonglitime;
      }
      this.nongli = showCal();
      this.currentDate =  this.datetime + " " + this.nongli;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index{
    display: flex;
    min-height: 92vh;
    flex-direction: column;
  }
  header {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #fff;
    color: rgb(0,102,255);
    font-weight: 600;
    box-shadow:0 1px 2px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.14);
  }
  .logoimg{
    margin: 0 20px 0 50px;
  }
  .webTitle{
    font-size:30px;
  }
  .descript{
    margin: 0 0 0 49px;
    font-size:15px;
    margin-top:15px;
    color:rgb(138, 129, 129);
  }
  .top-date{
    margin: 0 0 0 680px;
    font-size:30px;
    margin-top:10px;
    color:rgb(119, 111, 111);
  }
  .top-user{
    margin: 0 0 0 150px;
    color:#000;
  }

  .bottom{
    display: flex;
    flex: 1;
    margin:10px 0 0 0;
  }
  .middle-content {
    flex: 1;
  }
  .middle-left, .middle-right {
    flex: 0 0 16em;
  }
  .middle-left {
    order: -1;
    box-shadow:0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    border-radius: 5px;
  }
  .middle-right{
    box-shadow:0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    border-radius: 5px;
  }

  .left-top-title{
    margin:10px 0 10px 10px;
    text-align: left;
    font-size:25px;
  }
  .left-top-content{
    margin:10px 0 10px 10px;
    text-align: left;
    font-size:15px;
    height:700px;
    width:90%;
    overflow: hidden;
    line-height: 1.5em;
  }
  .left-bottom-content{
    margin:14px 0 10px 20px;
    text-align: left;
    font-size:35px;
    font-weight: bold;
    font-style: italic;
  }

  /* clock css */
  div,p{ 
    font-family: 'Microsoft Yahei' ;
    font-size: 14px;
  }
  .box{ 
    width: 200px; 
    height: 200px; 
    border:10px solid #8bf2f1;
    margin:10px 10px 10px 10px; 
    border-radius: 50%;
    box-shadow: 0px 0px 20px 3px #444 inset; 
    position: relative;
  }
  /*原点*/
  .origin{ 
    width: 10px; 
    height: 10px; 
    border-radius: 50%; 
    background: #ff0000; 
    top:95px; 
    left: 95px; 
    position: absolute;
  }
  /* 指针 */
  .clock_line{ 
    position: absolute;
    position:absolute;
    z-index:20;
  }
  .hour_line{
    width:50px;
    height:2px;
    top:99px;
    left:100px;
    background-color:#000;
    border-radius:2px;
    transform-origin:0 50%;
    box-shadow:1px -3px 8px 3px #aaa;
  }
  .minute_line{
    width:65px;
    height:1px;
    top:99px;
    left:95px;
    background-color:#000;
    transform-origin:7.692% 50%;
    box-shadow:1px -3px 8px 1px #aaa;
  }
  .second_line{
    width:85px;
    height:0.5px;
    top:99.7px;
    left:90px;
    background-color:#f60;
    transform-origin:11.765% 50%;
    box-shadow:1px -3px 7px 1px #bbb;
  }

  .dot_box{
    width: inherit; 
    height: inherit;
    
  }
  /*时钟数*/
  .dot{ 
    width: 20px; 
    height: 20px; 
    line-height: 20px; 
    text-align: center; 
    font-size: 11px; 
    position: absolute;
  }
  .clock-scale{
    width:97.5px;
    height:1px;
    transform-origin:0% 50%;
    z-index:7;
    position:absolute;
    top:99px;
    left:100px;
  }
  .scale-show{ 
    width:6px;
    height:1px;
    background-color:#555;
    float:left;
  }
  .scale-hidden{
    width:91.5px;
    height:1px;
    float:left;
  }
  /*日期*/
  .date_info{
    width:140px;
    height:14px; 
    line-height:14px;
    text-align:center;
    position:absolute;
    top:120px;
    left:35px;
    z-index:5.5;
    color:#555;
    font-weight:bold;}
  .time_info{ 
    width: 55px; 
    height: 17.5px; 
    line-height: 17.5px;
    text-align:center;
    position:absolute;
    top:140px;
    left:75px;
    z-index:5.5;
    color:#555; 
    background: #253e3e; 
  }
  .time{ 
    width: 17.5px ;
    height:17.5px; 
    float: left; 
    color: #fff; 
    font-size: 11px;
  }
  #minute_time{
    border-left:1px solid #fff;
    border-right:1px solid #fff;
  }


  .content-top{
    margin:10px 10px 10px 10px;
    height:20%;
  }
  .studyBtn,.workBtn,.lifeBtn,.enjoyBtn{
    width:250px;
    height:150px;
    margin:10px 50px 20px 50px;
    box-shadow:0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    font-size:40px;
    font-weight:bold;
  }
  .content-middle{
    margin:10px 20px 10px 20px;
    border:1px solid rgb(239, 239, 239);
    height:72%;
    box-shadow:0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    border-radius: 5px;
  }
  .content-bottom{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:20px;
  }

  .studyContent,.workContent,.lifeContent,.enjoyContent{
    margin:10px 10px 10px 10px;
    height:95%;
  }


  .bg-purple {
    background: #d3dce6;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 70px;
    margin: 10px 5px 10px 5px;
  }
  .grid-content-bottom{
    border-radius: 4px;
    min-height: 340px;
    margin: 10px 5px 10px 5px;
  }

  .useBtn{
    display: flex;
    margin-left: 20px;
  }
</style>
