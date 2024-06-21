const userModel = require('../models/userModel');
const tweetModel = require('../models/tweetModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/auth')



const homePage = (req,res) => {
    res.render('home',middleware.errorObj('',''));
};

const registerUser = (req,res) => {
    const {firstName,lastName,email,password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    if(!hashedPassword){
        res.render('home',middleware.errorObj('Password hashing failed',''));
    } else {
        const newUser =  new userModel({firstName,lastName,email,password:hashedPassword});
        newUser.save()
        .then(() => {
            res.render('home',middleware.errorObj('','now you can log in'))
        }).catch((err) => {
            console.log(err);
        });
    }
};

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    let correctPassword = bcrypt.compareSync(password,user.password);
    if(!correctPassword){
        res.render('logIn',middleware.errorObj('wrong password',''));
    } else{
        const usrrDataForToken = {
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email
        }
        const token = jwt.sign(usrrDataForToken,'hanna');
        res.cookie('usertoken',token);
        res.redirect('/tweet');
    }

};

const tweetPage = (req,res) => {
    const userinfo = req.cookies.usertoken
    var decoded = jwt.verify(userinfo, 'hanna');
    userModel.find()
    .populate('tweet')
    .then((data) => {

        res.render('tweets',{tweets:data,userinfo:decoded})
    }).catch((err) => {console.log(err);});
};

const addTweetPage = (req,res) => {
    const userinfo = req.cookies.usertoken
    var decoded = jwt.verify(userinfo, 'hanna');
    const errorsObj = middleware.errorObj('','');
    res.render('addTweet',{userinfo:decoded,errorsObj});
};

const addNewTweet = (req,res) => {
    const userinfo = req.cookies.usertoken;
    var decoded = jwt.verify(userinfo, 'hanna');
    const newtweet = new tweetModel({...req.body});
    newtweet.save()
    .then(() => {
        userModel.findById(decoded.id)
        .then((data) => {
            data.tweet.push(newtweet._id)
            data.save()
            .then(() => {
                res.redirect('/tweet');
            }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
};

const fullTweetPage = (req,res) => {
    const id = req.params.id;
    const userinfo = req.cookies.usertoken
    var decoded = jwt.verify(userinfo, 'hanna');
    tweetModel.findById(id)
    .then((tweet)=>{
        res.render('fullTweet',{tweet,userinfo:decoded})
    })


};

const updaetTweetPage = (req,res) => {
    const id = req.params.id;
    const userinfo = req.cookies.usertoken
    var decoded = jwt.verify(userinfo, 'hanna');
    const errorsObj = middleware.errorObj('','');
    tweetModel.findById(id)
    .then((tweet)=>{
        res.render('updateTweet',{tweet,userinfo:decoded,errorsObj})
    })
    .catch(err => console.log(err))
};

const updaetTweet = (req,res) => {
    const id = req.params.id;
    tweetModel.findByIdAndUpdate(id,req.body)
    .then(() => {
        res.redirect('/tweet');
    }).catch(err => console.log(err));
};

const deleteTweet = (req, res) => {
    const id = req.params.id;
    const userinfo = req.cookies.usertoken;
    const decoded = jwt.verify(userinfo, 'hanna');
  
    userModel.findById(decoded.id)
      .then((user) => {
        user.tweet = user.tweet.filter((tweetId) => tweetId !== id);
        return user.save();
      })
      .then(() => {
        return tweetModel.findByIdAndDelete(id);
      })
      .then(() => {
        res.redirect('/tweet');
      })
      .catch((err) => console.error(err));
  };

const logOut = (req,res) => {
    res.clearCookie('usertoken');
    res.render('home',middleware.errorObj('','you are logged out'))
};






module.exports ={
    homePage,
    registerUser,
    loginUser,
    tweetPage,
    addTweetPage,
    addNewTweet,
    logOut,
    fullTweetPage,
    updaetTweetPage,
    updaetTweet,
    deleteTweet
};