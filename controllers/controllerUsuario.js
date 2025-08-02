const modeloUsers = require("../models/modelUsuario")
const bcrypt=require("bcrypt")
module.exports = {

    inicioSession: function (req, res) {
        const { email, password } = req.body;

        modeloUsers.obtenerDatosUser(req.body.email, function (err, datos) {

            if (email === datos[0].email && password === datos[0].password) {
                req.session.gmail = email;
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
        if (req.session.gmail) {
            res.render("dashboard");
        } else {
            res.redirect("/");
        }
    },
    register: function (req, res) {

        modeloUsers.obtenerDatosUser(req.body.email, function (err, datos) {
            if (typeof req.body.email !== 'string') throw new Error(" Debe ser de tipo string");

            if (datos && datos.length) {
                req.flash('info', 'El correo ' + datos[0].email + ' existe')
                return res.redirect('/register');
            }

            if ((req.body.password).length <= 4) {
                req.flash('info', 'Debe ser mayor a 4 el password')
                return res.redirect('/register');

            }
            const hashedPassword=bcrypt.hashSync(req.body.password,10)

            modeloUsers.insertar(req.body,hashedPassword, function (err) {
                if (!err) {
                    req.flash('info', 'Registrado con exito', req.body)
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