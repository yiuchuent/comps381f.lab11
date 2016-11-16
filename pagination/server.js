var express = require('express');
var app = express();
var session = require('cookie-session');
var assert = require('assert');
var mongourl = 'mongodb://student:password@ds031873.mlab.com:31873/comps381f';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

app.use(session({
  name: 'session',
  keys: ['key1','key2'],
  maxAge: 5 * 60 * 1000
}));

app.set('view engine', 'ejs');

app.get('/clear', function(req,res) {
		req.session = null;
		res.end();
});

app.get("/list", function(req,res) {
	var items = [];
	MongoClient.connect(mongourl, function(err, db) {
    assert.equal(err,null);
    console.log('Connected to MongoDB\n');
		if (!req.session.last) {
      db.collection('items').find().sort({item:1}).limit(10).toArray(function(err,results) {
        if (err) {
          console.log(err);
        } else {
          db.close();
          req.session.last = 1;
          console.log('showing: ' + req.session.last);
          res.render('list',{'items':results});
        }
      });
		} else {
      db.collection('items').find().sort({item:1}).skip(req.session.last * 10).limit(10).toArray(function(err,results) {
        if (err) {
          console.log(err);
        } else {
          db.close();
          var count = req.session.last;
          count++;
          req.session.last = count;
          console.log('showing: ' + req.session.last);
          res.render('list',{'items':results});
        }
      });
		}
	});
});

app.listen(process.env.PORT || 8099);
