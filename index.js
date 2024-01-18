const dotenv = require('dotenv');
dotenv.config();
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session");
const config = require("./config/config")



const express = require('express')
const app = express()

// nocache
const nocache = require("nocache");
app.use(nocache());



app.use(session({
    secret: config.generateRandomString(32),
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_DB);
const port = process.env.PORT || 3000;


// for User routes 

const userRoute = require('./routes/userRoute')
app.use('/', userRoute);


// for Admin route
const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute);

// for error page
app.get('*', function (req, res) {
    res.render('./user/error')
})



app.listen(port, () => {
    console.log(`Server running at \x1b[35mhttp://localhost:3000/\x1b[0m`);

})
