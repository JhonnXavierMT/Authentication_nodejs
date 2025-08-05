
const db = require("../config/conections")

 module.exports={
    obtener:function(callback){
        db.query("SELECT * FROM users",callback);
    },
    insertar:function(datos,hashedPassword,callback) {
        db.query(
            "INSERT INTO users (email,password) VALUES(?,?)",
            [datos.email,
            hashedPassword
            ],callback
        );
    },
    obtenerDatosUser:function(email,callback) {
        db.query("SELECT * FROM users WHERE email=?",[email],callback);
    },
    validarUsuario:function (email,callback) {
      db.query("UPDATE users SET validado=true WHERE email=?",[email],callback);  
    },
    actualizarPass:function (email,pass,callback) {
      db.query("UPDATE users SET password=? WHERE email=?",[pass,email],callback);  
    }
 }