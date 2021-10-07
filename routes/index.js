var fs = require('fs');
var express = require('express');
var router = express.Router();

var svg = fs.readFileSync('./public/images/Dell_Power_Connect_3524P_switch.svg', 'utf8');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { svg });
});

module.exports = router;
