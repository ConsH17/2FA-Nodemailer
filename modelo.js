var mysql      = require('mysql');
var jwt= require('jsonwebtoken');
var nodemailer = require('nodemailer');
var modelo = {};

var hostDB = 'localhost';
var userDB = 'root';
var passBD = '';
var databaseDB = 'prueba';

modelo.inicio = function(nombre, callback)
{
    callback(null, {nombre: nombre, status: "Conectado"})
}

modelo.verificar = function(email,pass,callback)
{
var conexion = mysql.createConnection({
    host: hostDB,
    user: userDB,
    password: passBD,
    database: databaseDB,
});

conexion.connect((err)=>
{
    if (err)
    {
        console.log(err);
    }
}
);

if(conexion)
{
    var consulta = "select * from usuarios where Correo='"+email+"' and Pass='"+pass+"'"; 

    conexion.query(consulta, function(err, fila){
        if(err)
        {
            console.log(err);

        }else{
            if(fila.lenght >=1){
                var token = jwt.sign({email: email},'clavetoken2024');
                console.log("Hola");
                callback(null,{status:"OK",datos: fila,token: token, mensaje: "usuario encontrado"})

            }
            else {
               
                var token = jwt.sign({email: email},'clavetoken2024');
                callback(null,{status:"OK",datos: fila,token: token, mensaje: "usuario encontrado"})
            }
        }
    });
}
conexion.end();
}
modelo.enviarCorreo = function(email,token,callback)
{
    let transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:'ejemplo correo',
            pass:'12345'
        }
    });

    let mailOptions = {
        from: 'ejemplo correo',
        to: email,
        subject: 'Confirmacion del correo',
        html: '<p>Has click en el siguiente link <a href="http://localhost:3000/verificarToken?token='+token+'"> Has click aqui </a> </p>'
    }

    transporter.sendMail(mailOptions, (error,info)=>{
        if(error)
            {
            console.log(error);
        }
        else
        {
            console.log("Correo enviado exitosamente");
            callback(null,{status:'OK',mensaje: "Correo enviado exitosamente"})
        }
    
        
        
            
        
    })
}

module.exports = modelo;