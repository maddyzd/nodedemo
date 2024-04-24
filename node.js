const http = require('http');
const url = require('url');
const querystring = require('querystring');
const mongodb = require('mongodb');

// MongoDB connection
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Create HTTP server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;

  if (pathname === '/') {
    // Serve HTML form for Home view
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
      <head><title>Stock Search</title></head>
      <body>
        <form action="/process" method="GET">
          <label>Search:</label>
          <input type="text" name="searchTerm" placeholder="Enter stock ticker or company name" required>
          <br>
          <label><input type="radio" name="searchBy" value="ticker"> Search by Ticker</label>
          <label><input type="radio" name="searchBy" value="companyName"> Search by Company Name</label>
          <br>
          <button type="submit">Search</button>
        </form>
      </body>
      </html>
    `);
    res.end();
  } else if (pathname === '/process' && req.method === 'GET') {
    // Process form data for Process view
    const queryData = reqUrl.query;
    const searchTerm = queryData.searchTerm;
    const searchBy = queryData.searchBy;

    client.connect(err => {
      if (err) throw err;

      const collection = client.db('stock').collection('PublicCompanies');

      // Perform database query based on search criteria
      let query = {};
      if (searchBy === 'ticker') {
        query = { ticker: searchTerm };
      } else if (searchBy === 'companyName') {
        query = { name: searchTerm };
      }

      collection.find(query).toArray((err, result) => {
        if (err) throw err;

        // Display retrieved data in the console
        console.log(result);

        // Send the data as a response to the user
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    });
  } else {
    // Handle 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }
});

// Start the server
client.connect(err => {
  if (err) throw err;
  console.log('Connected to MongoDB');
  server.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
