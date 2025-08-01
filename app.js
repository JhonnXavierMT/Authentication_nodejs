const express = require('express');
const app = express();
const path = require("path")
const routes=require("./routes/route")
const chalk=require("chalk");
const morgan =require("morgan")
const cookieParser=require("cookie-parser")
const session = require('express-session');

app.use(cookieParser());
app.use(morgan("common"));

app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use("/img", express.static(path.join(__dirname, "public", "img")));

app.set("view engine", "ejs"); // EJS setup
app.set("views", path.join(__dirname, "views")); 

app.use(
    session({
        secret:"Hol@mundo123789(informta()23CoXD)",
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*5,
        },
    })
);

app.use(express.urlencoded({extended:true}));



app.use("/",routes);


app.listen(3000,()=>{
     console.log(
        chalk.bgHex("#1994ffff").white.bold(" ☄️ EXPRESS SERVER STARTED ☄️ ")
    );
    console.log(
        chalk.green("Running at: ") + chalk.cyan("http://localhost:3000")
    );
    console.log(chalk.gray("Press Ctrl+C to stop the server."));
})