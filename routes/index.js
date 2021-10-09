var fs = require('fs');
var express = require('express');
var router = express.Router();

var svg = fs.readFileSync('./public/images/Dell_Power_Connect_3524P_switch.svg', 'utf8');
var power = fs.readFileSync('./public/images/power.svg', 'utf8');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('get index');
  res.render('index', { svg, power });
});

module.exports = router;
