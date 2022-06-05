//Aim:- To Print the words said the Commentator On Last Ball of the match
//node 1_LastBallCommentary.js

const request = require("request");
const cheerio = require("cheerio");
const url ="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/ball-by-ball-commentary";
request(url, cb); 
function cb(err, response, html) {
  if (err) {
    console.log("error");
  } else {
    extractHtml(html);
  }
}
function extractHtml(html) {

  let $ = cheerio.load(html); 
  let elementArray = $("div[itemprop] .ci-html-content"); 
  let text = $(elementArray[1]).text(); //second last Ball
  let text2 = $(elementArray[0]).text(); // last Ball
  console.log(text2);
  console.log(text);
}
