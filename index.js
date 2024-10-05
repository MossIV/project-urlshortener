require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const app = express();

mongoose.connect(process.env.MONGO_URI)

var urlSchema = new mongoose.Schema({
  _id: Number,
  originalUrl: String
})
var Url = mongoose.model("Url", urlSchema);
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", function (req, res) {
  dns.lookup(req.body.url, function (err, address, family) {
    if (err != null) {
      res.json({ error: "invalid url" })
    }
    else {
      Url.countDocuments().then(count => {
        var original = new Url({
          _id: count,
          originalUrl: req.body.url
        })
        original.save().then((saved => { saved === original }));
        res.json({
          original_url: req.body.url,
          short_url: count
        })
      })
    }
  })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
