var express = require('express');
var app = express();
var session = require('cookie-session');
var assert = require('assert');
var mongourl = 'mongodb://localhost:27017/test';

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

app.use(session({
  name: 'session',
  keys: ['key1','key2'],
  maxAge: 5 * 60 * 1000
}));

app.set('view engine', 'ejs');

app.get("/list", function(req,res) {
	var items = [];
	req.session.currentItem = (req.session.currentItem >= 0)? req.session.currentItem += 1 : 0;
	console.log("currentItem "+ req.session.currentItem);
	MongoClient.connect(mongourl, function(err, db) {
    assert.equal(err,null);
    console.log('Connected to MongoDB\n');

      db.collection('items').find().skip(req.session.currentItem * 10).limit(10).toArray(function(err,results) {
        if (err) {
          console.log(err);
        } else {
          db.close();
          res.render('list',{'items':results});
        }
      });
	});
});

app.get("/clear", function(req,res) {
	req.session = null;
	res.redirect('/list');
});

app.listen(process.env.PORT || 8099);
