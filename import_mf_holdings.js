const connection = require("./server.js");
 const cheerio = require("cheerio");
 const got = require('got');
 
 
 async function generateQueries(topFunds) {
	 
	  const output = new Array();;
	 await Promise.all(topFunds.map(async (raw) => {
			try {
				let fundName = raw.fund_name.replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace(/\s/g, "-").toLowerCase();
				let fundKey = raw.fund_key;
				let holdingUrl ="https://www.moneycontrol.com/mutual-funds/" +  fundName +  "/portfolio-holdings/" + fundKey;
				let createQuary = `INSERT INTO  portfolio_holdings(stock_name, fund_key, sector, value, percentage_of_total_holding, one_month_change, one_year_highest_holding, one_year_lowest_holding, quantity, one_month_change_quantity)values`
				
				
				
				let result = await getHoldingDetails(holdingUrl ) 
				
				
				result.forEach((raw)=>{
				createQuary = createQuary + '('
				createQuary = createQuary +  "'" + raw[3].trim() + "'," 
				createQuary = createQuary +  "'" + fundKey + "'," 
				//createQuary = createQuary +  "'" +$(element).find(".sn").text() + "',"  
				createQuary = createQuary +  "'" +raw[4].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[5].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[6].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[7].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[8].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[9].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[10].trim()+ "'," 
				createQuary = createQuary +  "'" +raw[11].trim()+ "'"  
				createQuary = createQuary + '),'

				})
				
				
				
				createQuary = createQuary.replace(/,+$/, "") 
				createQuary = createQuary + " ON DUPLICATE KEY UPDATE "
				createQuary = createQuary + "stock_name =  values(stock_name),"
				createQuary = createQuary + "fund_key =  values(fund_key),"
				createQuary = createQuary + "sector = values(sector)," 
				createQuary = createQuary + "value = values(value)," 
				createQuary = createQuary +  "percentage_of_total_holding = values(percentage_of_total_holding),"
				createQuary = createQuary +  "one_month_change=  values(one_month_change),"
				createQuary = createQuary +  "one_year_highest_holding=  values(one_year_highest_holding),"
				createQuary = createQuary +  "one_year_lowest_holding=  values(one_year_lowest_holding),"
				createQuary = createQuary +  "quantity=  values(quantity),"
				createQuary = createQuary +  "one_month_change_quantity=  values(one_month_change_quantity)" 
				
				connection.query(createQuary, function(err, results, fields) {
					if (err) {
					  console.log(err.message);
					}
					 output[fundKey]=results 
				  });
				
				 //output[fundKey]=createQuary 
			} catch (error) {
			  console.log('error'+ error);
			}
		}))
   //console.log(output) // gets loged first
	 
	 
	 
	 return output;
	 
	 
	  
    } 



  function getHoldingDetails (vgmUrl )  {
	  
    return new Promise((resolve, reject)=>{
		
		  try {
			  
			    got(vgmUrl).then(response => {
                const raw = [];
                const $ = cheerio.load(response.body);
                let output = [];
			    
				  $("#equityCompleteHoldingTable tbody > tr").each((index, element) => {
			        
			         raw.push($(element).text().split("\n"));
		          }); 
				   //console.log(raw)
				 //  console.log(vgmUrl + " --- "  )
                        resolve(raw);
				})
				 
				
		   }   catch (err) {
			 
			   reject(err);
		  }
 
    });
};
 
	
	
	
	
	   async function fetchTopFunds() {
		 return new Promise((resolve, reject)=>{
  		    connection.connect(function (err) {
					  if (err) {
						return console.error("error: " + err.message);
					  }

					 connection.query("SELECT * FROM top_mutual_funds ORDER BY fund_key", function (err, results, fields) {
						if (err) {
						  console.log(err.message);
						}
						resolve(results);
					 });
            });
						
		 })			  
			 
     } 
 
 
 

async function showServiceCost() {
    let topFunds = await fetchTopFunds();
    
	await generateQueries(topFunds).then((result)=>{
			  
			  console.log(result)
	connection.end(function(err) {
		if (err) {
		  return console.log(err.message);
		}
		 console.log("MySql Connection closed ");
	  });
		  } )
	     
		
	}
//}

showServiceCost();