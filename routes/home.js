const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const ProductDB = require('../DataBase/addProduct');
const DB = require('../DataBase/db');
const db = new DB();
const productDB = new ProductDB();
const upload = require('express-fileupload');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookie());
// router.use(express.static('uploads'));
router.use(express.static(__dirname + '/uploads'));
router.use(upload());

router.get('/', async (req, res) => {

    let products = await productDB.getProducts();
    res.render('home', { 'products': products});
})

router.post('/addProduct', async (req, res) => {
    await db.addProduct(req.cookies.id, req.body.id);
    res.redirect('/home');
})

router.post('/wishList', async (req, res) => {
    await db.addToWishList(req.cookies.id, req.body.id);
    res.redirect('/home');
})

router.get('/buy', (req, res) => {
    res.render('purchased');
    // res.redirect('/home/cart');
})

router.get('/cart', async (req, res) => {
    let userId = req.cookies.id;
    let productsId = await db.getProducts(userId);
    let products = [];
    let totalAmount = 0;
    for (let i = 0; i < productsId.length; i++) {
        let product = await productDB.getProduct(productsId[i]);
        totalAmount = totalAmount + product.MRP;
        products.push(product);
    }

    // console.log(totalAmount);
    res.render('cart', { 'products': products, 'total': totalAmount });
});

router.get('/wishList', async (req, res) => {
    let userId = req.cookies.id;
    let productsId = await db.getWishlistProducts(userId);
    let products = [];
    for (let i = 0; i < productsId.length; i++) {
        let product = await productDB.getProduct(productsId[i]);
        products.push(product);
    }

    // console.log(totalAmount);
    res.render('wishList', { 'products': products });
});

router.get('/placeOrder', (req, res) => {
    res.redirect('/home');
});

router.get('/addUserProduct', (req, res) => {
    res.render('addUserProducts');
});

router.post('/addUserProduct',async (req, res) => {
    let { name, companyName, mrp } = req.body;
    
    let photo = req.files.photo.name;
    req.files.photo.mv('./public/' + photo, function () { });

    await productDB.addProduct(name, companyName, photo, mrp, req.cookies.id);

    res.redirect('/home');
});

router.post('/details',async (req, res) => {
    
    // const id = req.body.id;
    const userId = req.cookies.id;
    const name = await db.getName(userId);
    // console.log(req.body);
    // await productDB.addReview(name, "Hello ", id);
    let product = await productDB.getProduct(req.body.id);
    // console.log(product);
    
    res.render('details', { 'product': product});
});

router.post('/review', async (req, res) => {
    let review = req.body.review;
    let userId = req.cookies.id;
    let productId = req.body.id;
    const name = await db.getName(userId);
    // console.log(req.body);

    await productDB.addReview(name, review, productId);
    res.redirect('/home');
})

module.exports = router;