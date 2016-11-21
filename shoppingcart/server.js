var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

var SECRETKEY = 'I want to pass COMPS381F';

app.use(fileUpload());
app.use(bodyParser.json());
app.use(session({
	secret: SECRETKEY,
	resave: true,
	saveUninitialized: true
}));

var products = [
	{name: 'Apple iPad Pro', stock: 100, price: 7000, id:'001'},
	{name: 'Apple iPhone 7', stock: 50, price: 7800, id:'002'},
	{name: 'Apple Macbook', stock: 70, price: 11000, id: '003'}
];

app.set('view engine', 'ejs');

app.get("/read", function(req,res) {
	res.render("list", {c: products});
});

app.get('/showdetails', function(req,res) {
	if (req.query.id != null) {
		for (var i=0; i<products.length; i++) {
			if (products[i].id == req.query.id) {
				var product = products[i];
				break;
			}
		}
		if (product != null) {
			res.render('details', {c: product});
		} else {
			res.status(500).end(req.query.id + ' not found!');
		}
	} else {
		res.status(500).end('id missing!');
	}
});

app.get('/shoppingcart', function(req,res) {
	var cart = (req.session.cart === undefined)? [] :req.session.cart;
	res.render('shoppingcart', {c: cart});
});

app.get('/add2cart', function(req,res) {

	var id = req.query.id;
	var cart = (req.session.cart === undefined) ? [] :req.session.cart;
	var itemExist = false;
	for (i in cart) {
		if (cart[i].id == id) { 
			itemExist = true;
			cart[i].qty+= 1;  
			break;
		}
	}
	if (!itemExist) {
		for (j in products) {
			if (products[j].id == id) { 
				var product = products[j];
				product.qty = 1;
				cart.push(product); 
				break; 
			} 
		}
	}
	req.session.cart = cart;
	res.redirect('/shoppingcart');
})

app.get('/emptycart',function(req,res) {
	req.session.destroy();
	res.redirect('/shoppingcart');
})


app.listen(process.env.PORT || 8099);
