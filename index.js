require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", function(req, res){
  dns.lookup(req.body.url,function(err,address,family){
    console.log(err)
    if(err.code=="ENOTFOUND"){
      res.json({error: "invalid url"})
    }
    else{
      res.json({
        original_url:req.body.url,
        short_url:""
      })
    }
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
