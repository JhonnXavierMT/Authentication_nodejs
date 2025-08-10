const express = require('express')
const route = express.Router()
const controllerusers = require("../controllers/controllerUsuario")
const middlewareVerific=require("../middlewares/middw_verificar_datos")
const passport = require('passport');
const Admins=require('../middlewares/autentications_rol_admin_')

route.get('/login/google', passport.authenticate('google'));

route.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}));

route.get('/auth/facebook', passport.authenticate('facebook',
  { scope: ['email', 'public_profile'] }
));

route.get('/oauth2/redirect/facebook',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/dashboard');
});

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
route.get("/dashboardAdmin",Admins.SoloAdmin, controllerusers.dashboardAdmins);
// Crear una ruta protegida solo para el admi
route.get("/register", controllerusers.newregister);
route.post("/enviarNewEmail", controllerusers.eviaremailnew);

route.post("/newregister",middlewareVerific.verificar, controllerusers.register);
route.get("/verificar/:token", controllerusers.verificarToken)
route.get("/share_cod", controllerusers.shareCodigo);
route.post("/share_cod", controllerusers.mandarCodigo);
route.get("/cod_verific", controllerusers.vercodigoEmail);
route.post("/cod_verific", controllerusers.verificarCodigo);
route.get("/new_pass", controllerusers.verNewPass);
route.post("/new_pass", controllerusers.actualizarPassword);

module.exports = route
