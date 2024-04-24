var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');

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
	res.write ("Processing<br/>");
    var body = '';
    req.on('data', chunk => { body += chunk.toString();  });
    req.on('end', () => 
        { 
        res.write ("Raw data string: " + body +"<br/>");
	    var id = qs.parse(body).id;      // assumes x is post data parameter	
        res.write ("The id is " + id );
        res.end();
        });
  }
}).listen(8080);
