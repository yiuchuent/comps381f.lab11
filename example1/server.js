var express = require('express');
var session = require('express-session');
app = express();

// middleware
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: true
}));

app.get('/visit', function(req,res) {
  console.log(req.session.nvisit);
  req.session.nvisit = (req.session.nvisit >= 0) ? req.session.nvisit += 1 : 1;
  if (req.session.nvisit > 1) {
    res.send('Welcome back!  This is your ' + req.session.nvisit + ' visits');
  } else {
    res.send('Welcome!');
  }
});

app.listen(process.env.PORT || 8099);
