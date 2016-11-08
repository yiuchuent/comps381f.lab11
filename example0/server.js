var session = require('cookie-session');
var express = require('express');

app = express();
app.set('trust proxy', 1);

// middleware
app.use(session({
  name: 'session',
  keys: ['key1','key2']
}));

app.get('/visit', function(req,res,next) {
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

app.listen(process.env.PORT || 8099);
