var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const connStr= "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  urlObj = url.parse(req.url,true)
  path = urlObj.pathname;
  if (path == "/")
  {
    file="form.html";
    fs.readFile(file, function(err, home) {
    res.write(home);
    res.end();
    })
  }
  else if (path == "/process")
  {  
	console.log('hey')
 	MongoClient.connect(connStr, function(err, db) {
    
	  if(err) { console.log(err); }
	  else {
	    var dbo = db.db("Stock");
	    var collection = dbo.collection('PublicCompanies');
	    console.log("Success!");
	    db.close();
	  }
	});
  }
}).listen(8080);
