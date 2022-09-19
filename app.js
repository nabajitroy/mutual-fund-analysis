const fs = require("fs");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const cheerio = require("cheerio");
const connection = require("./server.js");
//const vgmUrl= 'https://www.moneycontrol.com/mutual-funds/kotak-small-cap-fund-direct-plan/portfolio-holdings/MKM516';
const vgmUrl =
  "https://www.moneycontrol.com/mutual-funds/idfc-sterling-value-fund-regular-plan/portfolio-holdings/MAG162";

got(vgmUrl)
  .then((response) => {
    const $ = cheerio.load(response.body);
    let output = [];
    var createQuary = ` INSERT INTO  portfolio_holdings( 
	stock_name,
	fund_key,
	sector,
	value,
	percentage_of_total_holding,
	one_month_change,
	one_year_highest_holding,
	one_year_lowest_holding,
	quantity,
	one_month_change_quantity
	)values`;

    $("#equityCompleteHoldingTable tbody > tr").each((index, element) => {
      let row = $(element).text().split("\n");
      //console.log(row)
      createQuary = createQuary + "(";
      createQuary = createQuary + "'" + row[3].trim() + "',";
      createQuary = createQuary + "'MAG162',";
      createQuary = createQuary + "'" + row[5].trim() + "',";
      createQuary = createQuary + "'" + row[7].trim() + "',";
      createQuary = createQuary + "'" + row[8].trim() + "',";
      createQuary = createQuary + "'" + row[9].trim() + "',";
      createQuary = createQuary + "'" + row[10].trim() + "',";
      createQuary = createQuary + "'" + row[11].trim() + "',";
      createQuary = createQuary + "'" + row[12].trim() + "',";
      createQuary = createQuary + "'" + row[13].trim() + "'";
      createQuary = createQuary + "),";
    });
    createQuary = createQuary.replace(/,+$/, "");
    createQuary = createQuary + " ON DUPLICATE KEY UPDATE ";
    createQuary = createQuary + "stock_name =  values(stock_name),";
    createQuary = createQuary + "fund_key = values(fund_key),";
    createQuary = createQuary + "sector = values(sector),";
    createQuary = createQuary + "value = values(value),";
    createQuary =
      createQuary +
      "percentage_of_total_holding = values(percentage_of_total_holding),";
    createQuary = createQuary + "one_month_change = values(one_month_change),";
    createQuary =
      createQuary +
      "one_year_highest_holding = values(one_year_highest_holding),";
    createQuary =
      createQuary +
      "one_year_lowest_holding = values(one_year_lowest_holding),";
    createQuary = createQuary + "quantity = values(quantity),";
    createQuary =
      createQuary +
      "one_month_change_quantity = values(one_month_change_quantity)";

    //  console.log(createQuary);

    connection.connect(function (err) {
      if (err) {
        return console.error("error: " + err.message);
      }

      connection.query(createQuary, function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
        console.log(results);
      });

      connection.end(function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("MySql Connection closed ");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
