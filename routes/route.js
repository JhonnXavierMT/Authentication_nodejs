const express = require('express')
const route = express.Router()
const controllerusers = require("../controllers/controllerUsuario")
//------------------Acciones------------------
route.post("/login", controllerusers.inicioSession)
route.get("/logout", controllerusers.logout);

/* route.post("/register",controllerusers.register) */
route.get("/protected", (res, req) => {
    res.send("Hola")
});

//----------------rutas vistas---------------------
route.get("/", controllerusers.index);

route.get("/dashboard", controllerusers.dashboard);

route.get("/register", controllerusers.newregister);
route.post("/newregister", controllerusers.register);

module.exports = route
