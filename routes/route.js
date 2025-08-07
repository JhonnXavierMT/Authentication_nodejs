const express = require('express')
const route = express.Router()
const controllerusers = require("../controllers/controllerUsuario")
const passport = require('passport');

route.get('/login/google', passport.authenticate('google'));

route.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}));

route.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email', 'public_profile']}));

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

route.get("/register", controllerusers.newregister);
route.post("/newregister", controllerusers.register);
route.get("/verificar/:token", controllerusers.verificarToken)
route.get("/share_cod", controllerusers.shareCodigo);
route.post("/share_cod", controllerusers.mandarCodigo);
route.get("/cod_verific", controllerusers.vercodigoEmail);
route.post("/cod_verific", controllerusers.verificarCodigo);
route.get("/new_pass", controllerusers.verNewPass);
route.post("/new_pass", controllerusers.actualizarPassword);

module.exports = route
