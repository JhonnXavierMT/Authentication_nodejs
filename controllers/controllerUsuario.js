const modeloUsers = require("../models/modelUsuario")
const bcrypt=require("bcrypt")
module.exports = {

    inicioSession:async function (req, res) {
        const { email, password } = req.body;

        modeloUsers.obtenerDatosUser(req.body.email,async function (err, datos) {

            if(!(datos && datos.length)){
                req.flash('info', 'El usuario '+email+' no existe')
                return res.redirect('/');
            }
            
            const isValid= await bcrypt.compare(password,datos[0].password)//<== promesa
            
            if (email === datos[0].email && isValid) {
                req.session.email = email;
                res.redirect("/dashboard");
            } else {
                res.send("fallo en inicio de session");
            }
        })
    },
    logout: function (req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.send("Error de salida de session");
            }
            res.clearCookie("connect.sid");
            res.redirect('/');
        });
    },
    index: function (req, res) {
        res.render("index");
    },
    dashboard: function (req, res) {
        if (req.session.email) {

            res.render("dashboard",{user_email:req.session.email});
        } else {
            res.redirect("/");
        }
    },
    register: async function (req, res) {

        modeloUsers.obtenerDatosUser(req.body.email,async function (err, datos) {
            if (typeof req.body.email !== 'string') throw new Error(" Debe ser de tipo string");

            if (datos && datos.length) {
                req.flash('info', 'El correo ' + datos[0].email + ' existe')
                return res.redirect('/register');
            }

            if ((req.body.password).length <= 4) {
                req.flash('info', 'Debe ser mayor a 4 el password')
                return res.redirect('/register');

            }
            const hashedPassword= await bcrypt.hash(req.body.password,10)//<= promesa

            modeloUsers.insertar(req.body,hashedPassword, function (err) {
                if (!err) {
                    req.flash('info', 'Registrado con exito')
                }
                else {
                    req.flash('info', 'NO Registrado')
                }
                res.redirect('/');
            })
        })
    },
    newregister: function (req, res) {
        res.render('registro')
    }
}