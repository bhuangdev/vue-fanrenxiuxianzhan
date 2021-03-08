const express = require('express')
const app = express()

app.use(require('cors')())
app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/fanrenxiuxianzhan',{
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex:true
})

const News = mongoose.model('News', new mongoose.Schema({
    no: { type: Number },
    title: { type:String },
    link: { type:String }
}))

const ImportantDate = mongoose.model('ImportantDate', new mongoose.Schema({
    date1: { type: String },
    date2: { type: String },
    date3: { type: String },
    date4: { type: String },
    date5: { type: String },
    date6: { type: String }
}))

app.get('/', async(req,res)=>{
    res.send('index')
})

app.get('/api/importantdate', async(req,res)=>{
    const importantdate = await ImportantDate.find()
    res.send(importantdate)
})

app.delete('/api/importantdate/:id',async(req,res)=>{
    await ImportantDate.findByIdAndDelete(req.params.id)
    res.send({
        status:true
    })
})


app.post('/api/importantdate', async(req,res) => {
    const importantdate = await ImportantDate.create(req.body)
    res.send(importantdate)
})

app.listen(3001, ()=> {
    console.log('http://localhost:3001/')
})

const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const nodeSchedule = require("node-schedule");
const weiboURL = "https://s.weibo.com";
const hotSearchURL = weiboURL + "/top/summary?cate=realtimehot";
function getHotSearchList() {
  return new Promise((resolve, reject) => {
    superagent.get(hotSearchURL, (err, res) => {
      if (err) reject("request error");
      const $ = cheerio.load(res.text);
      let hotList = [];
      $("#pl_top_realtimehot table tbody tr").each(function (index) {
        if (index !== 0) {
          const $td = $(this).children().eq(1);
          const link = weiboURL + $td.find("a").attr("href");
          const text = $td.find("a").text();
          const hotValue = $td.find("span").text();
          const icon = $td.find("img").attr("src")
            ? "https:" + $td.find("img").attr("src")
            : "";
          hotList.push({
            index,
            link,
            text,
            hotValue,
            icon,
          });
        }
      });
      hotList.length ? resolve(hotList) : reject("errer");
    });
  });
}
nodeSchedule.scheduleJob("1 1 * * * *", async function () {
  try {
    const hotList = await getHotSearchList();
    await fs.writeFileSync(
      `${__dirname}/hotSearch.json`,
      JSON.stringify(hotList),
      "utf-8"
    );
  } catch (error) {
    console.error(error);
  }
});