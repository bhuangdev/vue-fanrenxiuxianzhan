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
nodeSchedule.scheduleJob("30 * * * * *", async function () {
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