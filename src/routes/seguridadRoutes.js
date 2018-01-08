const Seguridad = require('../models/seguridad');
module.exports = function(app){

  //@params
  //@body{}
  //@headers{ usrNick, usrPassword }
  //@route ../login
  //Busca los datos para el usuario que coincide con
  //las credenciales ingresadas
  app.get('/login/', (req, res) => {
    const credenciales = {
      usrNick:      req.get('usrNick'),
      usrPassword:  req.get('usrPassword')
    };

    Seguridad.sessionCreate(credenciales, (err, data) => {
      if(err){
        res.status(500).json(err);
      } else {
        res.status(200).json(data);
      }
    });
  });

  //@params
  //@body{}
  //route ../session/:token ( token de la sesion del usuario )
  //@headers{}
  //Servicio solo disponible para probar un token en desarrollo
  app.get('/session/:token', (req, res) => {
    Seguridad.sessionIsActive(req.params.token, (err, data) => {
      if(err){
        res.status(500).json(err);
      } else {
        res.status(200).json(data);
      }
    });
  });

  //@params
  //@body{}
  //route ../groups
  //@headers{ token }
  //Busca y retorna un json con todos los grupos de la aplicación
  app.get('/groups', (req, res) => {
    Seguridad.sessionIsActive(req.get('token'), (err, data) => {
      if(err){
        res.status(500).json(err);
      } else {
        //Funcion Principal
        Seguridad.getGroups((err, data) => {
          if(err){
            res.status(500).json(err);
          } else {
            res.status(200).json(data);
          }
        });
        //-----------------
      }
    });
  });

  //@params
  //@body{}
  //@headers{ token }
  //@route ../group/:id ( id del grupo a buscar )
  //Busca y retorna un json con los datos del grupo
  //con el id pasado como parametro
  app.get('/group/:id', (req, res) => {
    Seguridad.sessionIsActive(req.get('token'), (err, data) => {
      if(err){
        res.status(500).json(err);
      } else {
        //Funcion Principal
        Seguridad.getGroup(req.params.id, (err, data) => {
          if(err){
            res.status(500).json(err);
          } else {
            res.status(200).json(data);
          }
        });
        //-----------------
      }
    });
  });

/*
  app.post('/users', (req, res) => {
    const userData = {
      usrId: null,
      usrNick: req.body.usrNick,
      usrName: req.body.usrName,
      usrLastName: req.body.usrLastName,
      usrComision: req.body.usrComision,
      usrPassword: req.body.usrPassword,
      grpId: req.body.grpId,
      usrEsAdmin: req.body.usrEsAdmin
    }

    User.insertUser(userData, (err, data) => {
      if(data && data.insertId){
        res.status(200).json({
          success: true,
          msg: 'Usuario Insertado',
          data: data
        })
      } else {
        res.status(500).json({
          success: false,
          msg: data
        })
      }
    });
  });
  */
}
