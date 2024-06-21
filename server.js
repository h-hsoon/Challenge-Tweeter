const express = require('express');
const router = require('./config/routres');
require("./config/mongo");
const cookieParser = require('cookie-parser')


const app = express();
const port = 3000;

app.use(cookieParser());
app.use("/public" ,express.static('public'))
app.set('view engine', 'ejs' );
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(router);

app.listen(port,() => {
    console.log(`Server started on port ${port}`);
})