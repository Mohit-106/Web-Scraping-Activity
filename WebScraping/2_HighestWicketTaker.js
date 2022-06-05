//Aim:- To Print Name and Wicket Taken by Bowler Of Winning Team(Highest Wicket Taker)
//node 2_HighestWicketTaker.js


const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
request(url, cb);

function cb(err, response, html) {
  if (err) {
    console.log("error");
  } else {
    extractData(html);
  }
}
let losingTeamName;
function extractData(html) {
  let $ = cheerio.load(html);
  let teamArr = $(".ci-team-score a[href]");
  losingTeamName = $(teamArr[0]).text();
  losingTeamName = losingTeamName.trim()
  const htmldata = "http://127.0.0.1:5500/4_WebScraping/1_CricInfo/index.html"; 

  request(htmldata, func);
  function func(err, response, data) {
    if (err) {
      console.log("error");
    } else {
      handleTOcheerio(data);
    }
  }

  function handleTOcheerio(data) {
    let $ = cheerio.load(data);
    let innigsArr = $(".table-data");
    let hwt = 0;
    let pname = "";
    for (let i = 0; i < innigsArr.length; i++) {
      let teamNameele = $(innigsArr[i]).find(".name"); 
      let teamName = teamNameele.text(); 
      teamName = teamName.split("INNINGS")[0];
      teamName = teamName.trim();
      
      if (losingTeamName == teamName) {   
        let table_ele = $(innigsArr[i]).find(".bowling-data");
        let playerData = $(table_ele).find("tr"); 
        for (let j = 0; j < playerData.length; j++) { 
          let rowData = $(playerData[j]).find("td");   
          let PlayerNAme = $(rowData[0]).text().trim(); 
          let wickets = $(rowData[4]).text();
          if (wickets > hwt) {
            hwt = wickets;
            pname = PlayerNAme;
          }
        }
      }
      
    }
    console.log("Player Name:-",pname,"Wickets=",hwt);
  }
}
