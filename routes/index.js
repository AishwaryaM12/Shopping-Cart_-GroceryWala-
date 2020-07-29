var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
const Handlebars = require("handlebars");
/* GET home page. */
router.get('/', function(req, res, next) {
	var successMsg =req.flash('success')[0];
	Product.find(function(err , docs){
		
		var productChunks = [];
		var chunkSize = 3;
		for (var i = 0; i < docs.length; i+= chunkSize) {
			productChunks.push(docs.slice(i,i+chunkSize));
		}
			
		res.render('shop/index', { products: productChunks , successMsg: successMsg, noMessages:!successMsg});
	});
	
	  
});
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});


router.get('/add-to-cart/:id',function(req, res, next){
	var productId= req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
});

router.get('/custom', function(req, res,next){
	res.render('shop/custom');
});

router.get('/reduce/:id', function(req,res,next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req,res,next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/shopping-cart',function(req,res,next){
	if(!req.session.cart){
		return res.render('shop/shopping-cart',{products:null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart',{products:cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', isLoggedIn,function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_sIAtHkDSwrP9jvGE8V76OxsI00sg2n3PSP"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100 ,
        currency: "usd",
        shipping: {
				    name: 'Jenny Rosen',
				    address: {
				      line1: '510 Townsend St',
				      postal_code: '98140',
				      city: 'San Francisco',
				      state: 'CA',
				      country: 'US',
				    },
				  },
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 
});

module.exports = router;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
