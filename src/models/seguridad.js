'use strict';
const connection = require('../db');
var duracionDeLaSesion = 30; //Valor expresado en minutos

let seguridadModel = {};

seguridadModel.sessionCreate = (credenciales, callback) => {
  if(connection){
    connection.query(
      'Select * from sisusers where usrNick = \'' + credenciales.usrNick + '\'' +
      'and usrPassword = \'' + credenciales.usrPassword + '\'',
      (err, rows) => {
        if(err){
          callback(err, null);
        } else {
          if(rows.length > 0){
            var nuevoToken = generateRandomString(255);
            connection.query(
              'Update sisusers set usrLastAcces = NOW(), usrToken = \''+ nuevoToken + '\' where usrId = ? ',rows[0]['usrId'], (err_) => {
                if(err_){
                    callback({err: 'Error al iniciar la sesión'}, false);
                }
              }
            );
            rows[0]['usrToken'] = nuevoToken;
            callback(null, rows);
          } else {
            callback({err: 'Usuario y/o contraseña incorrectos'}, rows);
          }

        }
      }
    );
  }
};

seguridadModel.sessionIsActive = (token, callback) => {
  if(connection){
    connection.query(
      'Select * from sisusers where usrToken = ? ', token,
      (err, row) => {
        if(err){
          callback(err, false);
        } else {
          if(row.length > 0){
            //Hay o hubo una session
            //Se debe validar que este activa
            var ahora = new Date(Date.now());
            var ultimoAcceso = new Date(row[0]['usrLastAcces']);

            var diferencia = ahora - ultimoAcceso;
            var diferenciaEnMinutos = Math.round(diferencia / 60000);
            if(diferenciaEnMinutos > duracionDeLaSesion){
              //La session se da por terminada
              callback({err: 'La sesión a espirado'}, false);
            } else {
              //Actualizar fecha con ultimo acceso
              connection.query(
                'Update sisusers set usrLastAcces = NOW() where usrToken = ? ',token, (err_) => {
                  if(err_){
                      callback({err: 'Error al actualizar la sesión'}, false);
                  } else {
                      callback(null, true);
                  }
                }
              );
            }
          } else {
            callback({err: 'La sesión no existe'}, false);
          }
        }
      }
    );
  }else{
    callback({database: 'Service not avaible'}, false);
  }
};

function generateRandomString(length = 10) {
  var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  var randomString = '';
  for (var i = 0; i < length; i++) {
      randomString += characters[Math.floor((Math.random() * (charactersLength - 1)) + 1)];
  }
  return randomString;
}

seguridadModel.getGroups = (callback) => {
  if(connection){
    connection.query(
      'Select * from sisgroups',
      (err, rows) => {
        if(err){
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

seguridadModel.getGroup = (id, callback) => {
  if(connection){
    connection.query(
      'Select * from sisgroups where grpId = ?', id,
      (err, rows) => {
        if(err){
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

/*
seguridadModel.insertUser = (userData, callback) => {
  if(connection){
      connection.query(
        'Insert into sisusers Set ? ', userData,
        (err, result) => {
          if(err){
            callback(null, {
              'msg': err
            })
          } else {
            callback(null, {
              'insertId': result.insertId
            })
          }
        }
      );
  }
};
*/

module.exports= seguridadModel;
