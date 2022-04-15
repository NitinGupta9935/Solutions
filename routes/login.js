const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('../DataBase/db');
const db = new DB();
const router = express.Router();
const bcrypt = require('bcrypt');


router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
    let loginError = req.cookies.error || '';
    if (loginError != '')
        res.clearCookie('error');
    res.render('login', { error: loginError }); 
});

router.post('/',async (req, res) => {
    let { number, password } = req.body;
    // password = await decryptPassword(password);
    if (await db.isNumberExist(number)) {
        //     // number is exist

        if (await db.isPasswordCorrect(number, password)) {
            // number and password is correct
            res.cookie('id', await db.getId(number));
            // res.cookie('number', number);
            res.redirect('/home');
        }
        else { 
            // password incorrect
            res.cookie('error', "password Incorrect");
            res.redirect('/');
        }
    }
    else {
        res.cookie('error', 'Number not exist');
        res.redirect('/');
    }

});

router.get('/signUp', (req, res) => {
    let numberError = req.cookies.error || '';
    if (numberError != '')
        res.clearCookie('error');
    res.render('signUp', { error: numberError });
});

router.post('/signUp', async (req, res) => {
    let { firstName, lastName, email, password, number } = req.body;
    // password = await decryptPassword(password);
    // console.log(password);
    if (await db.isNumberExist(number)) {
        res.cookie('error', "Entered number is already Exist");
        res.redirect('/signUp');
    }
    else {
        let id = await db.signUp(firstName, lastName, email, password, number);
        res.cookie('id', id);
        // res.cookie('number', number);
        res.redirect('/home');
    }
});

async function decryptPassword(password) {
    const salt = await bcrypt.genSalt(3);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

module.exports = router;