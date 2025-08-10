const modeloUsers = require("../models/modelUsuario")
module.exports = {
    verificar: function (req, res, next) {
         modeloUsers.obtenerDatosUser(req.body.email, async function (err, datos) {
             if (typeof req.body.email !== 'string') throw new Error(" Debe ser de tipo string");

             if (datos && datos[0].validado==false) {
                req.session.TempEmail=req.body.email
                req.flash('info','Usted ya esta registrado revise su correo y de click a el link de validar correo, Si no recibio un correo de click a Enviar Link de verificacion')
                return res.redirect('/register?estado=true')
             }
             if (datos && datos.length) {
                 req.flash('info', 'El correo ' + datos[0].email + ' existe')
                 return res.redirect('/register?estado=false');
             }
             if ((req.body.password).length <= 4) {
                 req.flash('info', 'Debe ser mayor a 4 el password')
                 return res.redirect('/register?estado=false');
             }
             next();
         });
    }
}