const request = require("request");
const cheerio = require("cheerio");

const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

function MatchUrls(url) {
  request(url, cb);
}

function cb(err, response, html) {
  if (err) {
  } else {
    ExtractInfoAllTeams(html);
  }
}

function ExtractInfoAllTeams(html) {
  let $ = cheerio.load(html);
  let Venue = $(".mch_hdr-lft .mch_hdr-lft-a").text();

  let Result = $(".matchresult").text();

  let dateData = $(".mch_hdr-lft span");
  let Tempdate = dateData.text().split(",");
  let day = Tempdate[1].trim();
  let year = Tempdate[2].trim();
  let Date = day + ", " + year;

  let MatchBetween = $(".mid_hdr-ttl").text();
  let Match = MatchBetween.split("Scorecard");
  let Teams = Match[0].trim();

  let innigs1 = $(".ful_scr-crd");
  let T1 = $(innigs1).find("#inning1");
  let Team1 = T1.text().trim();
  let T2 = $(innigs1).find("#inning2");
  let Team2 = T2.text().trim();
  let FinalScore = Team1+" "+Team2;

  for (let i = 0; i < 1; i++) {
    
    let TableData = $(innigs1).find(
      ".swiper-wrapper >.swiper-slide > .ful_scr-cnt > .ful_scr-tbl tbody"
    );

    for (let j = 0; j < TableData.length; j++) {
      if (j == 0 || j == 3) {

        let trow = $(TableData[j]).find("tr");
        for (let k = 0; k < trow.length; k++) {
          let allCols = $(trow[k]).find("td");
          let NotWorthy = $(allCols[0]).hasClass("tbl_sld-wrp");
          if (NotWorthy == false) {
            let pname = $(allCols[0]).text().trim();
            let run = $(allCols[1]).text().trim();
            let ball = $(allCols[2]).text().trim();
            let fours = $(allCols[3]).text().trim();
            let sixes = $(allCols[4]).text().trim();
            let SR = $(allCols[5]).text().trim();
            processPlayer(
              Teams,
              Venue,
              Date,
              pname,
              run,
              ball,
              fours,
              sixes,
              SR,
              FinalScore,
              Result
            );
          }
        }
      } else if (j == 2 || j == 5) {
        let trow = $(TableData[j]).find("tr");
        for (let k = 0; k < trow.length; k++) {
          let allCols = $(trow[k]).find("td");
          let pname = $(allCols[0]).text().trim();
          let Overs = $(allCols[1]).text().trim();
          let Maiden = $(allCols[2]).text().trim();
          let Runs = $(allCols[3]).text().trim();
          let Wickets = $(allCols[4]).text().trim();
          let Economy = $(allCols[5]).text().trim();
          processPlayerBowler(
            Teams,
            Venue,
            Date,
            pname,
            Overs,
            Maiden,
            Runs,
            Wickets,
            Economy,
            FinalScore,
            Result
          );
        }
      }
    }
  }
}

function processPlayerBowler(
  Teams,
  Venue,
  Date,
  pname,
  Overs,
  Maiden,
  Runs,
  Wickets,
  Economy,
  FinalScore,
  Result
) {
  let teamPath = path.join(__dirname, "ipl", Teams + Date);

  dirCreator(teamPath);
  let filePath = path.join(teamPath, pname + ".xlsx");
  let content = excelReader(filePath, pname);
  let PlayerObj = {
    Match: Teams,
    Venue: Venue,
    Date: Date,
    Overs: Overs,
    Maiden: Maiden,
    Runs: Runs,
    Wickets: Wickets,
    Economy: Economy,
    FinalScore:FinalScore,
    Result: Result,
  };
  content.push(PlayerObj);
  excelWriter(content, pname, filePath);
}

function processPlayer(
  Teams,
  Venue,
  Date,
  pname,
  run,
  ball,
  fours,
  sixes,
  SR,
  FinalScore,
  Result
) {
  let teamPath = path.join(__dirname, "ipl", Teams + Date);
  dirCreator(teamPath);
  let filePath = path.join(teamPath, pname + ".xlsx");
  let content = excelReader(filePath, pname);
  let PlayerObj = {
    Match: Teams,
    Venue: Venue,
    Date: Date,
    Runs: run,
    Balls: ball,
    Fours: fours,
    Sixes: sixes,
    SR: SR,
    FinalScore:FinalScore,
    Result: Result,
  };
  content.push(PlayerObj);
  excelWriter(content, pname, filePath);
}

//this function will create a unique directory
function dirCreator(FilePath) {
  if (fs.existsSync(FilePath) == false) {
    fs.mkdirSync(FilePath);
  }
}

//Function to write data in excel
function excelWriter(json, sheetName, Filepath) {
  let newWB = xlsx.utils.book_new();
  let newWs = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB, newWs, sheetName);
  xlsx.writeFile(newWB, Filepath);
}

//Function to read data from Excel
function excelReader(FilePath, sheetName) {
  if (fs.existsSync(FilePath) == false) {
    return [];
  }
  let wb = xlsx.readFile(FilePath);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  ps: MatchUrls,
};
