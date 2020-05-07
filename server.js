'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var validUrl = require('valid-url');

var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json({ type: 'application/*+json' })

var app = express();


// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

// I use array instead of mongodb for learning purposes.

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var urlEncodedParser = bodyParser.urlencoded({ extended: true }); // for parsing application/x-www-form-urlencoded


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlBags = [];

  
// API
app.post("/api/shorturl/new", urlEncodedParser, function (req, res) {


  let url = req.body.url;

  // check if URL is valid

    if(validUrl.isUri(url)) {
        const shortenUrl = {original_url: url, short_url: Date.now()}
        urlBags.push(shortenUrl);
        console.log(urlBags);
        res.json(shortenUrl);
    }else{
      res.json({
          error:'invalid URL'
      })
    }
});



app.get("/api/shorturl/:short_url?", function(req, res, next){

    // map short url from array

    console.log(req.params.short_url);
    //urlToRedirect = '';
    let mappedUrls = urlBags.map(function(item){

        if(item.short_url == req.params.short_url){
             return item.original_url;
        }
    });


    // redirect

    var urlToRedirect = mappedUrls.find((item)=>{
        return item !== undefined
    });

    if(urlToRedirect === undefined){
        res.json({
            error:'Invalid URL'
        })
    }else{
        res.redirect(urlToRedirect);

    }



});


app.listen(port, function () {
  console.log('Node.js listening on port ' + port);
});