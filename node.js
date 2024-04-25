const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const connStr = "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("This goes to the console window");

http.createServer(function (req, res) {
    console.log(`Received request for path: ${req.url}`);
}).listen(port, () => {
    console.log(`Server running on port ${port}`);
  
    console.log('Connecting to MongoDB...');
    MongoClient.connect(connStr, function(err, db) {
        if (err) { 
            console.log(err);
        } else {
            const dbo = db.db("Stock");
            const collection = dbo.collection('PublicCompanies');
            console.log("Connected to MongoDB!");
            db.close();
        }
    });
});
