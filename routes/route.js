const express = require('express');
const route = express.Router();

route.post("/login",(req,res)=>{
    const {username,password}=req.body;
    const user_bd="jhonn";
    const password_bd="123456";
    if (username===user_bd && password===password_bd) {
        req.session.username=username;
        res.redirect("/dashboard");
    } else {
        res.send("fallo en inicio de session");
    }
})
route.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if (err) {
            return res.send("Error de salida de session");
        }
        res.clearCookie("connect.sid");
         res.redirect('/');
    });
});

route.get("/",(req,res)=>{
    res.render("index");
}); 

route.get("/dashboard",(req,res)=>{
    if (req.session.username) {
        res.render("dashboard");
    } else {
        res.redirect("/");
    }
}); 
module.exports=route
