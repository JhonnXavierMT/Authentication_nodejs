const modeloUsers = require("../models/modelUsuario")
const enviarEmaildeVerificacion = require("../services/email.service")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
const { render } = require("ejs");
const jsonwebtoken = require('jsonwebtoken');

dotenv.config();

module.exports = {
    inicioSession: async function (req, res) {
        const { email, password } = req.body;

        modeloUsers.obtenerDatosUser(req.body.email, async function (err, datos) {

            if (!(datos && datos.length)) {
                req.flash('info', 'El usuario ' + email + ' no existe')
                return res.redirect('/');
            }
            if (!datos[0].validado) {
                req.flash('info', 'El usuario ' + email + ' no esta validado revise su email para validar')
                return res.redirect('/');
            }
            const isValid = await bcrypt.compare(password, datos[0].password)//<== promesa
            // validar si esta validada la cuenta en true se pueda ingresar al inicio de session
            if (email === datos[0].email && isValid) {
                req.session.email = email;
                req.session.rol=datos[0].rol
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
        if (req.isAuthenticated() || req.session.email) {
            if (!req.session.email) {
                const { email } = req.user;
                req.session.email = email
            }
            res.render("dashboard", {
                /* user_name: name, */
                user_email: req.session.email,
                user_rol:req.session.rol
                /* user_photo: photo?.[0]?.value || "/img/default-avatar.png" */
            });
        } else {
            res.redirect("/");
        }
    },
    register: async function (req, res) {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)//<= promesa
        //Antes de enviar el token
        const tokenVerificacion = jsonwebtoken.sign(
            { email: req.body.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        //mandamos para verificar el correo email
        const email = await enviarEmaildeVerificacion.enviarEmail(req.body.email, tokenVerificacion, enviarEmaildeVerificacion.crear_html)

        if (email.accepted === 0) {
            return res(500).send({ status: "error", message: "Error al enviar el email de verificacion" })
        }
        modeloUsers.obtener((err, datos) => {
            let rol;
            if (!req.body.rol) {
                console.log(datos.length)
                rol = datos.length > 0 ? 'user' : 'admin';
            }
            else {
                rol = req.body.rol;
            }
            modeloUsers.insertar(req.body, hashedPassword, rol, function (err) {
                if (!err) {
                    req.flash('success', 'Registrado con exito Revise su email para verificar su cuenta')
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
    },
    //en caso de que no se verifique en los 15 min el token morira entonces crear una funcion que envien otro token para el email para verificar y en caso de que el usuario no envien ni verifique eliminar su cuenta
    verificarToken: function (req, res) {
        try {
            if (!req.params.token) {
                return res.redirect("/");
            }
            const decodificada = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET);
            if (!decodificada) {
                return res.redirect("/").send({ status: "error", message: "error de token" });
            }
            modeloUsers.validarUsuario(decodificada.email, function (err) {
                if (err) {
                    return res.redirect("/register")
                }
                req.session.email = decodificada.email;
                req.flash("info", "bienvenido", req.session.email);
                res.redirect("/dashboard");
            })
        } catch (error) {
            res.status(500);
            res.redirect("/")
        }
    },
    shareCodigo: function (req, res) {
        try {
            res.render("share_cod")
        } catch (error) {
            res.status(500);
            res.redirect("/")
        }
    },
    mandarCodigo: async function (req, res) {
        try {
            const codigo = Math.floor(Math.random() * 9000) + 1000
            //mandamos para verificar el correo email
            const email = await enviarEmaildeVerificacion.enviarEmail(req.body.email, codigo, enviarEmaildeVerificacion.crear_html_rec_Password)

            if (email.accepted === 0) {
                return res(500).send({ status: "error", message: "Error al enviar el email de verificacion" })
            }

            req.session.datosUsuario = {
                email: req.body.email,
                cod: codigo
            };
            console.log("---------------------------------")
            console.log(req.session.datosUsuario)
            console.log("---------------------------------")
            /* req.flash("info", "Se envio un codigo a su email") */
            res.redirect("/cod_verific");
        } catch (error) {
            res.status(500);
            res.redirect("/")
        }
    },
    vercodigoEmail: function (req, res) {
        res.render("cod_verific")
    },
    verificarCodigo: function (req, res) {
        try {
            console.log("---------------------")
            console.log(req.body.codigo)
            console.log(req.session.datosUsuario.cod)
            console.log("---------------------")
            if (req.body.codigo == req.session.datosUsuario.cod) {
                res.redirect("/new_pass");
            } else {
                req.flash("info", "codigo incorrecto");
                return res.redirect("/cod_verific")
            }
        } catch (error) {
            res.status(500);
            res.redirect("/")
        }
    },
    verNewPass: function (req, res) {
        res.render("new_pass")
    },
    actualizarPassword: async function (req, res) {
        if (req.body.newpasswordOne !== req.body.newpasswordTwo) {
            req.flash("info", "Las contraseñas no son iguales")
            return res.redirect('/new_pass');
        }
        const hashedPassword = await bcrypt.hash(req.body.newpasswordOne, 10)//<= promesa

        modeloUsers.actualizarPass(req.session.datosUsuario.email, hashedPassword, function (err) {
            if (!err) {
                req.flash('info', 'Actualizado con exito')
            }
            else {
                req.flash('info', 'NO actualizado')
            }
            req.session.email = req.session.datosUsuario.email
            delete req.session.datosUsuario;
            res.redirect("/dashboard")
        })
    }

}