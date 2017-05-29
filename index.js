var express = require('express');
var bodyParser = require('body-parser');
var jsf = require('json-schema-faker');

jsf.extend('faker', function () {
  return require('faker');
});

var app = express();

var port = process.env.PORT || 8080;

var demoUser = 'demo@demo.com';
var demoPass = 'demo';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

var schema = {
  "id": "User",
  "type": 'object',
  properties: {
    "id": {
      "type": "integer",
      "minimum": 1,
      "maximum": 700,
      "multipleOf": 1,
      "exclusiveMinimum": true
    },
    "name": {
      type: 'string',
      faker: 'name.findName'
    },
    "email": {
      type: 'string',
      format: 'email',
      faker: 'internet.email'
    },
    "city": {
      type: 'string',
      format: 'city',
      faker: 'address.city'
    },
    "phoneNumber": {
      type: 'string',
      faker: 'phone.phoneNumber'
    },
    "birthDate": {
      "type": "string",
      "chance": {
        "birthday": {
          "string": true
        }
      }
    }
  },
  required: ['id', 'name', 'email', 'city', 'phoneNumber', 'birthDate']
};

router.use(function (req, res, next) {

  if (req.url != '/login') {
    console.log('====================================');
    console.log(req.headers);
    console.log('====================================');
    console.log(req.url);
    console.log('====================================');
  }

  next();
});

router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.post('/login', function (req, res) {
  var user = req.body.email;
  var pass = req.body.password;
  if (user == demoUser && pass == demoPass) {
    res.json({
      success: true,
      token: '64698691-4774-42f7-98d4-d9762a2e3312',
      data: {
        name: 'Demo User'
      }
    });
  } else {
    res.json({
      success: false,
      token: null,
      data: {}
    });
  }
});

router.get('/user', function (req, res) {
  let users = [];
  for (var i = 0; i < 10; ++i) {
    var user = jsf(schema);
    users.push(user);
  }
  
  res.json(users);
});


app.use('/api', router);


app.listen(port);

console.log('API server started on: ' + port);