
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
    }
 }