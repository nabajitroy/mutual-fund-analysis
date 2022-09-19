const fs = require('fs');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const cheerio = require('cheerio');
 const connection = require('./server.js');
const vgmUrl= 'https://www.moneycontrol.com/mutual-funds/best-funds/equity/ranks/1';


got(vgmUrl).then(response => {

   const $ = cheerio.load(response.body);
    let output = [];
	var createQuary =` INSERT INTO  top_mutual_funds( 
	fund_key,
	fund_name,
	fund_category,
	crisil_rank,
	aum_in_cr,
	1_week_return,
	1_month_return,
	3_month_return,
	6_month_return,
	ytd,
	1_year_return,
	2_year_return,
	3_year_return,
	5_year_return,
	10_year_return
	)values`

	$("#dataTableId tbody > tr").each((index, element) => {
		let row = $(element).text().split("\n"); 
	 //	let link =$(element[0]).find(".robo_medium");
		//var link = $(element).attr('href');
		 
		 if(row[2].trim()=='Regular'){
		 console.log( row   )
		createQuary = createQuary + '('
		createQuary = createQuary +  "'" + $(element).find(".robo_medium").attr('href').split('/')[6] + "'," 
		createQuary = createQuary +  "'" +row[1].split('-')[0].trim()+ "'," 
		createQuary = createQuary +  "'" +$(element).find(".sn").text() + "',"  
		createQuary = createQuary +  "'" +row[4].trim()+ "'," 
		createQuary = createQuary +  "'" +row[5].trim()+ "'," 
		createQuary = createQuary +  "'" +row[6].trim()+ "'," 
		createQuary = createQuary +  "'" +row[7].trim()+ "'," 
		createQuary = createQuary +  "'" +row[8].trim()+ "'," 
		createQuary = createQuary +  "'" +row[9].trim()+ "'," 
		createQuary = createQuary +  "'" +row[10].trim()+ "'," 
		createQuary = createQuary +  "'" +row[11].trim()+ "'," 
		createQuary = createQuary +  "'" +row[12].trim()+ "'," 
		createQuary = createQuary +  "'" +row[13].trim()+ "'," 
		createQuary = createQuary +  "'" +row[14].trim()+ "',"
		createQuary = createQuary +  "'" +row[15].trim()+ "'" 
		createQuary = createQuary + '),'
		 }	 	 
   
    });
	createQuary = createQuary.replace(/,+$/, "") 
	createQuary = createQuary + " ON DUPLICATE KEY UPDATE "
	createQuary = createQuary + "fund_key =  values(fund_key),"
	createQuary = createQuary + "fund_name = values(fund_name)," 
	createQuary = createQuary + "fund_category = values(fund_category)," 
	createQuary = createQuary +  "crisil_rank = values(crisil_rank),"
	createQuary = createQuary +  "aum_in_cr=  values(aum_in_cr),"
	createQuary = createQuary +  "1_week_return=  values(1_week_return),"
	createQuary = createQuary +  "1_month_return=  values(1_month_return),"
	createQuary = createQuary +  "3_month_return=  values(3_month_return),"
	createQuary = createQuary +  "6_month_return=  values(6_month_return),"
	createQuary = createQuary +  "ytd=  values(ytd),"
	createQuary = createQuary +  "1_year_return=  values(1_year_return),"
	createQuary = createQuary +  "2_year_return=  values(2_year_return),"
	createQuary = createQuary +  "3_year_return=  values(3_year_return),"
	createQuary = createQuary +  "5_year_return=  values(5_year_return),"
	createQuary = createQuary +  "10_year_return=  values(10_year_return)"
	
     console.log(createQuary); 
   
 connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

   

  connection.query(createQuary, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
	  console.log(results);
  });

  connection.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
	 console.log("MySql Connection closed ");
  });
});
    
 
}).catch(err => {
  console.log(err);
});