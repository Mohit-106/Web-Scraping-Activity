const url = "https://sports.ndtv.com/ipl-2022";
const request = require("request");
const cheerio = require("cheerio");

const fs = require("fs");
const path = require("path");
const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

const allMatchObj = require("./AllMatches");

request(url, cb);
function cb(err, response, html) {
  if (err) {
  } else {
    handOverToCheerio(html);
  }
}

function handOverToCheerio(html) {
  let $ = cheerio.load(html);
  let aele = $(".sub-nv_li a[title='IPL 2022  Fixtures']");
  let link = aele.attr("href");
  let fulllink = "https://sports.ndtv.com" + link;
  getAllMatchesLink(fulllink);
}

function getAllMatchesLink(link) {
  request(link, function (err, response, data) {
    if (err) {
    } else {
      allMatchObj.getAllmatches(data);
    }
  });
}

function dirCreator(FilePath) {
  if (fs.existsSync(FilePath) == false) {
    fs.mkdirSync(FilePath);
  }
}
