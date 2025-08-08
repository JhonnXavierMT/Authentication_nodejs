const express = require('express')
const app = express()
const path = require("path")
const routes = require("./routes/route")
const chalk = require("chalk")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const flash = require("connect-flash")
//------------------Para conectarse a google start---------------
const passport = require('passport');
const configureGoogleStrategy = require("./middlewares/google")
configureGoogleStrategy(passport)
//------------------Para conectarse a google end---------------
//------------------Para conectarse a Facebook start---------------
const configureFacebookStrategy = require("./middlewares/facebook")
configureFacebookStrategy(passport)
//------------------Para conectarse a facebook end---------------

app.use(cookieParser());
app.use(morgan("common"));

app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use("/img", express.static(path.join(__dirname, "public", "img")));

app.set("view engine", "ejs"); // EJS setup
app.set("views", path.join(__dirname, "views"));


app.use(
    session({
        secret: process.env['SECRET_COOKIE_SESSION'],
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 10,// 10 minutes
            httpOnly: true, // Protege contra XSS
            sameSite: 'lax' // Previene CSRF básico
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());


//usamos el flash
app.use(flash())

app.use((req, res, next) => {
    res.locals.info = req.flash('info');
    next();
})
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
})
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
})

// Middleware para leer datos del body
app.use(express.urlencoded({ extended: true }));



app.use("/", routes);


app.listen(3000, () => {
    console.log(
        chalk.bgHex("#1994ffff").white.bold(" ☄️ EXPRESS SERVER STARTED ☄️ ")
    );
    console.log(
        chalk.green("Running at: ") + chalk.cyan("http://localhost:3000")
    );
    console.log(chalk.gray("Press Ctrl+C to stop the server."));
})