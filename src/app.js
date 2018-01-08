const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

//Settings
app.set('port', process.env.PORT || 3000);

//middleWeare
//Si comentamos esta linea no se ven las peticiones
//por consola
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
require('./routes/seguridadRoutes')(app);

app.listen(app.get('port'), () => {
  console.log('server on port 3000');
});
