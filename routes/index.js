var express = require('express');
var router = express.Router();
//日付を指定型に整形できるパッケージ
var moment = require('moment');
var connection = require('./mysqlConnection');


router.get('/', function(req, res, next)
{

  var query = 'SELECT B.board_id, B.user_id, B.title, ifnull(U.user_name, \'名無し\') AS user_name, DATE_FORMAT(B.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM boards B LEFT OUTER JOIN users U ON B.user_id = U.user_id ORDER BY B.created_at DESC';
  connection.query(query, function(err, rows)
  {
    console.log(rows);
    res.render('index.ejs',
    {
    	title: 'はじめてのNode.js',
    	boardList: rows
    });
  });
});

router.post('/', function(req, res, next) {
  var title = req.body.title;
  var userId = req.session.user_id? req.session.user_id: 0;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var query = 'INSERT INTO boards (user_id, title, created_at) VALUES ("' + userId + '", ' + '"' + title + '", ' + '"' + createdAt + '")';
  connection.query(query, function(err, rows) {
    res.redirect('/');
});
});
module.exports = router;
