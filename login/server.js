var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var SECRETKEY = 'I want to pass COMPS381F';
var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({
	secret: SECRETKEY,
	resave: true,
	saveUninitialized: true
}));

app.get('/',function(req,res) {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
	res.write('Hello, ' + req.session.username + '\n');
	res.end('This is a secret page!');
});

app.get('/login',function(req,res) {
	res.sendFile(__dirname + '/public/login.html');
});

app.post('/login',function(req,res) {
	for (var i=0; i<users.length; i++) {
		if (users[i].name == req.body.name && 
		    users[i].password == req.body.password) {
			req.session.authenticated = true;
			req.session.username = users[i].name;
		}
	}
	res.redirect('/');
});

app.get('/logout',function(req,res) {
	req.session.destroy();
	res.redirect('/');
});

app.listen(process.env.PORT || 8099);
