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

const StudyData = mongoose.model('StudyData', new mongoose.Schema({
  todayGoal: { type: String },
  monthGoal: { type: String },
  weekGoal: { type: String },
  yearGoal: { type: String },
  knowledgeData: { type: Array },
  actionData: { type: Array }
}))

const LifeData = mongoose.model('LifeData', new mongoose.Schema({
  textarea1: { type: String },
  textarea2: { type: String },
  textarea3: { type: String },
  textarea4: { type: String },
  textarea5: { type: String },
  textarea6: { type: String },
  textarea7: { type: String },
  textarea8: { type: String },
  textarea9: { type: String },
  textarea10: { type: String },
  textarea11: { type: String },
  textarea12: { type: String }
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

app.get('/api/studyData', async(req,res)=>{
  const studyData = await StudyData.find()
  res.send(studyData)
})

app.post('/api/studyData', async(req,res) => {
    const studyData = await StudyData.create(req.body)
    res.send(studyData)
})

app.delete('/api/studyData/:id',async(req,res)=>{
  await StudyData.findByIdAndDelete(req.params.id)
  res.send({
      status:true
  })
})

app.get('/api/LifeData', async(req,res)=>{
  const lifeData = await LifeData.find()
  res.send(lifeData)
})

app.post('/api/LifeData', async(req,res) => {
    const lifeData = await LifeData.create(req.body)
    res.send(lifeData)
})

app.delete('/api/lifeData/:id',async(req,res)=>{
  await LifeData.findByIdAndDelete(req.params.id)
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