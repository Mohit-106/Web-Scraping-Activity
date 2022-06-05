const request = require("request");
const cheerio = require("cheerio");
const ScoreObjects = require("./scorecard");
function ExtractLink(data) {
  let $ = cheerio.load(data);
  let scorecardElements = $(".sp-scr_wrp .url");
  for (let i = 0; i < scorecardElements.length; i++) {
    let link = $(scorecardElements[i]).attr("href");
    let fulllink = "https://sports.ndtv.com" + link;
    ScoreObjects.ps(fulllink);
  }
}
module.exports = {
  getAllmatches: ExtractLink,
};
