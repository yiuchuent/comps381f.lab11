var session = require('cookie-session');
var express = require('express');

app = express();

// middleware
app.use(session({
  name: 'session',
  keys: ['this is secret','don not tell anyone']
}));

app.get('/visit', function(req,res) {
  console.log('nvisit: ' + req.session.nvisit);
  req.session.nvisit = (req.session.nvisit >= 0) ? req.session.nvisit += 1 : 1;
  if (req.session.nvisit > 1) {
    res.send('Welcome back!  This is your ' + req.session.nvisit + ' visits');
  } else {
    res.send('Welcome!');
  }
});

app.get('/', function(req,res) {
  res.redirect('/visit');
})

app.get('/logout', function(req,res) {
  req.session = null;
  res.redirect('/');
})

app.listen(process.env.PORT || 8099);
