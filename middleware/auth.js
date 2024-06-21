const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

let errorObj = (err,mes) => {
    return {
        error: err,
        message: mes
        };
    
};

const newUserValidashn = async (req,res,next) => {
    const {firstName,lastName,email,password} = req.body;
    if(firstName === '' || lastName === '' || email === '' || password ===''){
        res.render('home',errorObj('all filde are ricoird',''))
    }else{
        if(password.length < 7){
            res.render('home',errorObj('password mast be more than 7 chrcter',''));
        }else{
            if(password !== req.body.confPassword){
                res.render('home',errorObj('password not match',''));
            }else{
                let eixesstUser = await userModel.findOne({email: email});
                if(eixesstUser){
                     res.render('home',errorObj('email already exsist ','you can log in her'));
                 } else{
                     next();
                 }
            }
       
        }
    }
};

const loginValidashn = async (req,res,next) => {
    const {email,password} = req.body;
    if(email === '' || password ===''){
        res.render('home',errorObj('all filde are ricoird',''))
        }else{
           let exsistUser = await userModel.findOne({email: email});
           if(!exsistUser){
            res.render('home',errorObj('email is not correct',''))
            }else{
                next();
            }
        }
};

const userIsLogedIn = (req,res,next) => {
    if(!req.cookies.usertoken){
        res.render('home',errorObj('log in',''))
    } else{
        next();
    }
};
const logInAuth = (req,res,next) => {
    if(req.cookies.usertoken){
        res.redirect('/tweet');
    } else{
        next();
    }

};

const newTweetvaledation = (req,res,next) => {
    const {title,content} = req.body;
    const userinfo = req.cookies.usertoken
    var decoded = jwt.verify(userinfo, 'hanna');
    let errorsObj = errorObj('','');
    if(title === ''){
        errorsObj.error = 'title is required and 20 min length';
        res.render('addTweet',{userinfo:decoded.id,errorsObj})
    }else if(content ===''){
        errorsObj.error = 'content is required and 50 min length'
        res.render('addTweet',{userinfo:decoded.id,errorsObj})
    }else if(title.length < 20){
        errorsObj.error = 'title is 25 min length'
        res.render('addTweet',{userinfo:decoded.id,errorsObj})
    }else if(content.length < 500){
        errorsObj.error = 'content is 100 min length'
        res.render('addTweet',{userinfo:decoded.id,errorsObj})
    }else{
        next();
    }
}

module.exports = {
    errorObj,
    newUserValidashn,
    loginValidashn,
    userIsLogedIn,
    newTweetvaledation,
    logInAuth
};