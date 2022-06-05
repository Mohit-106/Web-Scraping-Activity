//Aim :- To extract the information of the playuer who play in the match.
const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";
const cheerio = require("cheerio");
const request = require("request");

request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log("error occure");
  } else {
    extractusingCheerio(html);
  }
}

function extractusingCheerio(html) {
  let $ = cheerio.load(html);
  let teamArr = $(".ci-team-score a[href]");
  let DesierdTeam = $(teamArr[0]).text().trim();
  const surl = "http://127.0.0.1:5500/4_WebScraping/1_CricInfo/index.html";
  request(surl, func);
  function func(err, response, data) {
    if (err) {
      console.log("error occured");
    } else {
      handleTocheerio(data);
    }
  }

  function handleTocheerio(data) {
    let $ = cheerio.load(data);
    let innigsArr = $(".table-data");
    for (let i = 0; i < innigsArr.length; i++) {
      let teamNameAbstractData = $(innigsArr[i]).find(".name");
      let teamName = teamNameAbstractData.text();
      teamName = teamName.split("INNINGS")[0].trim();
      if (DesierdTeam == teamName) {
        let tableElem = $(innigsArr[i]).find(".batsman-table");
        let allBatsMan = $(tableElem).find("tr");
        for (let j = 0; j < allBatsMan.length; j++) {
          let bastterData = $(allBatsMan[j]).find("td");
          let isbatsManCol = $(bastterData[0]).hasClass("player-data");
          if (isbatsManCol == true) {
            let href = $(bastterData[0]).find("a").attr("href");
            let name = $(bastterData[0]).text().trim();
            let fullLink = "https://www.espncricinfo.com" + href;
            GetDob(fullLink,name,teamName);
          }
        }
      }
    }
  }
}

function GetDob(fulllink,name,teamName){
    request(fulllink,givedatahere);
    function givedatahere(err,response,data){
        if(err){
            console.log("Error occured");
        }else{
            GetNameAndDob(data,name,teamName);
        }

    }

}

function GetNameAndDob(data,name,teamName){

    let $ = cheerio.load(data);
    let info = $("div>span>h5");
    console.log(info.text().trim(),"Plays for",teamName);

}

