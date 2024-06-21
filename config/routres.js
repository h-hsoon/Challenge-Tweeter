const express = require('express');
const controler = require('../controllers/controller');
const middlware = require('../middleware/auth');
const { model } = require('mongoose');
const router = express.Router();

router.get('/',middlware.logInAuth,controler.homePage);
router.post('/register',middlware.newUserValidashn,controler.registerUser);
router.post('/login',middlware.loginValidashn,controler.loginUser);
router.get('/tweet',middlware.userIsLogedIn,controler.tweetPage);
router.get('/addNewTweet',middlware.userIsLogedIn,controler.addTweetPage);
router.post('/newTweet/:id',middlware.newTweetvaledation,controler.addNewTweet);
router.get('/logout',controler.logOut);
router.get('/tweet/:id',middlware.userIsLogedIn,controler.fullTweetPage);
router.get('/updaetTweet/:id',middlware.userIsLogedIn,controler.updaetTweetPage);
router.post('/update-Tweet/:id',middlware.newTweetvaledation,controler.updaetTweet);
router.get('/delete/:id',controler.deleteTweet);

module.exports = router;