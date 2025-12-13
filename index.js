const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require('connect-mongo'); // Add this
const config = require("./config/config");
const express = require('express');
const app = express();

// nocache
const nocache = require("nocache");
const PORT = process.env.PORT;
app.use(nocache());

app.set('trust proxy', 1);
// Set up MongoDB connection first
mongoose.connect(process.env.MONGO_DB, {
    dbName: 'shoeone' // Explicitly specify database name
});

// Configure session with MongoDB store
app.use(session({
    secret: config.generateRandomString(32),
    resave: false,
    saveUninitialized: false, // Changed to false for better performance
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        dbName: 'shoeone', // Specify the database name
        collectionName: 'sessions', // Optional: specify collection name for sessions
        ttl: 24 * 60 * 60 // Session TTL (1 day)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

// Error page
app.get('*', function (req, res) {
    res.render('./user/error');
});

app.listen(PORT, () => {
    console.log(`Server running at \x1b[35mhttp://localhost:3000/\x1b[0m`);
});

















// const dotenv = require('dotenv');
// dotenv.config();
// const path = require('path')
// const mongoose = require('mongoose')
// const session = require("express-session");
// const config = require("./config/config")



// const express = require('express')
// const app = express()

// // nocache
// const nocache = require("nocache");
// app.use(nocache());



// app.use(session({
//     secret: config.generateRandomString(32),
//     resave: false,
//     saveUninitialized: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.set('view engine', 'ejs')
// app.set('views', './views')
// app.use(express.static(path.join(__dirname, 'public')));

// mongoose.connect(process.env.MONGO_DB);
// const port = process.env.PORT || 3000;


// // for User routes 

// const userRoute = require('./routes/userRoute')
// app.use('/', userRoute);


// // for Admin route
// const adminRoute = require('./routes/adminRoute')
// app.use('/admin', adminRoute);

// // for error page
// app.get('*', function (req, res) {
//     res.render('./user/error')
// })



// app.listen(port, () => {
//     console.log(`Server running at \x1b[35mhttp://localhost:3000/\x1b[0m`);

// })
